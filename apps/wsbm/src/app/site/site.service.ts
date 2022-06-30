import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Result } from '@weishour/core/interfaces';
import { ApiException } from '@weishour/core/exceptions';
import { success } from '@weishour/core/utils';
import { AxiosError } from 'axios';
import {
  lastValueFrom,
  forkJoin,
  map,
  mergeMap,
  Observable,
  catchError,
  throwError,
  of,
} from 'rxjs';
import { isArray, isEmpty } from 'lodash';
import { Icon, SiteInfo } from './interfaces';
import type { Element } from 'domhandler';
import * as cheerio from 'cheerio';

@Injectable()
export class SiteService {
  constructor(private httpService: HttpService) {}

  /**
   * 获取站点信息
   * @param {string} url
   * @returns
   */
  async getInfo(url: string): Promise<Result> {
    const siteInfo: SiteInfo = {};

    const result = await lastValueFrom(
      this.httpService
        .get(url, {
          // proxy: false,
          responseType: 'document',
          headers: {
            Accept: '*/*',
            // 防止重定向到手机版网站 / 权限检查
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          },
        })
        .pipe(
          map(response => {
            if (response.status == 200) {
              const page = response.data;
              if (page && typeof page !== 'string' && !(page instanceof String)) {
                throw new ApiException('获取信息失败', HttpStatus.NOT_IMPLEMENTED);
              }

              return page;
            } else {
              throw new ApiException('解析地址失败', HttpStatus.NOT_IMPLEMENTED);
            }
          }),
          mergeMap<string, Observable<SiteInfo>>(page => {
            const $ = cheerio.load(page, {
              baseURI: url,
              lowerCaseTags: true,
              lowerCaseAttributeNames: true,
            });

            const urlObj = new URL(url);
            siteInfo.protocol = urlObj.protocol;
            siteInfo.origin = urlObj.origin;
            siteInfo.title = $('title', 'head').html();
            siteInfo.description = $('meta[name="description"]', 'head').attr('content');

            let icons: Icon[] = [];
            return forkJoin([
              this.links($, siteInfo),
              this.manifest($, siteInfo),
              this.favicon($),
              this.browserconfig($),
            ]).pipe(
              map(results => {
                results.forEach((icon: Icon[]) => (icons = [...icons, ...icon]));
                siteInfo.icons = icons;
                return siteInfo;
              }),
            );
          }),
          catchError((error: AxiosError) => {
            switch (error.code) {
              case 'ETIMEDOUT':
              case 'ECONNABORTED':
                throw new ApiException('获取站点信息超时', HttpStatus.NOT_IMPLEMENTED);
              default:
                return throwError(() => error);
            }
          }),
        ),
    );

    return success('获取站点信息成功', result);
  }

  /**
   * link标签
   * @param {cheerio.CheerioAPI} $
   * @returns Icon[]
   */
  private async links($: cheerio.CheerioAPI, siteInfo: SiteInfo): Promise<Icon[]> {
    let icons: Icon[] = [];
    const selectors = [
      "link[rel='icon']",
      "link[rel='shortcut icon']",
      "link[rel='apple-touch-icon']",
      "link[rel='apple-touch-icon-precomposed']",
      "link[rel='apple-touch-startup-image']",
      "link[rel='mask-icon']",
      "link[rel='fluid-icon']",
    ];

    selectors.forEach(selector => {
      $(selector).each((i, elem: Element) => {
        let { href, type } = elem.attribs;
        if (href && href !== '#') {
          if (href.startsWith('/') && !href.startsWith('//')) href = `${siteInfo.origin}${href}`;
          if (href.startsWith('//')) href = `${siteInfo.protocol}${href}`;

          if (href.startsWith('favicon') || href.startsWith('apple') || href.startsWith('safari')) {
            href = `${siteInfo.origin}/${href}`;
          }
          icons.push({ src: href, type });
        }
      });
    });

    // 获取base64
    await this.getBase64(icons);

    return icons;
  }

  /**
   * browser
   * @param {cheerio.CheerioAPI} $
   * @returns Icon[]
   */
  private async browserconfig($: cheerio.CheerioAPI): Promise<Icon[]> {
    let icons: Icon[] = [];

    const tileImage = $('meta[name="msapplication-TileImage"]', 'head').attr('content');

    if (tileImage) icons.push({ src: tileImage });

    // 获取base64
    await this.getBase64(icons);

    return icons;
  }

  /**
   * PWA网站
   * @param {cheerio.CheerioAPI} $
   * @returns Icon[]
   */
  private async manifest($: cheerio.CheerioAPI, siteInfo: SiteInfo): Promise<Icon[]> {
    let icons: Icon[] = [];

    const href = $('link[rel="manifest"]', 'head').attr('href');
    if (!href) return icons;

    const url = new URL(href, $['_options'].baseURI).href;
    const result = await lastValueFrom(this.httpService.get(url, { proxy: false }));
    if (result.status == 200) {
      const data = result.data;
      if (isArray(data.icons)) {
        icons = data.icons.map(({ src, sizes, type }) => {
          if (src.startsWith('/') && !src.startsWith('//')) src = `${siteInfo.origin}${src}`;
          return { src, sizes, type };
        }) || [];
      }
    }

    // 获取base64
    await this.getBase64(icons);

    return icons;
  }

  /**
   * favicon
   * @param {cheerio.CheerioAPI} $
   * @returns Icon[]
   */
  private async favicon($: cheerio.CheerioAPI): Promise<Icon[]> {
    let icons: Icon[] = [];
    const src = new URL('/favicon.ico', $['_options'].baseURI).href;

    icons = await lastValueFrom(
      this.httpService.get(src, { proxy: false, responseType: 'arraybuffer' }).pipe(
        map(response => {
          if (response.status == 200) {
            const headers = response.headers,
              size = parseInt(headers['content-length'], 10),
              type = headers['content-type'];

            if (size > 0) {
              const base64Buffer = Buffer.from(response.data, 'binary').toString('base64'),
                base64 = `data:${type || 'image/png'};base64,${base64Buffer}`;

              icons = [{ src, base64, size, type }];
            }
          }

          return icons;
        }),
        catchError(_ => of([])),
      ),
    );

    return icons;
  }

  /**
   * base64获取处理
   * @param icons
   */
  private async getBase64(icons: Icon[]): Promise<void> {
    for (let icon of icons) {
      const src = icon.src;

      let result = await lastValueFrom(
        this.httpService.get(src, { proxy: false, responseType: 'arraybuffer' }).pipe(
          map(response => {
            let base64 = '';
            let size = 0;
            if (response.status == 200) {
              const headers = response.headers,
                type = headers['content-type'];

              size = parseInt(headers['content-length'], 10);
              if (size > 0) {
                const base64Buffer = Buffer.from(response.data, 'binary').toString('base64');
                base64 = `data:${type || 'image/png'};base64,${base64Buffer}`;
              }
            }

            return { base64, size };
          }),
          catchError(_ => of({})),
        ),
      );

      if (!isEmpty(result)) {
        icon.base64 = result['base64'];
        icon.size = result['size'];
      }
    }
  }
}
