import { Injectable } from '@nestjs/common';
import { createHash, createDecipheriv, createCipheriv, Encoding } from 'crypto';
import argon2 from '@node-rs/argon2';

@Injectable()
export class CryptoUtil {
  /**
   * 加密
   * @param {string} algorithm 加密算法
   * @param {string} content 加密内容
   * @param {Encoding} format 格式
   */
  encrypt = (algorithm: string, content: string, format: Encoding) => {
    const hash = createHash(algorithm);
    hash.update(content, format);
    return hash.digest('hex');
  };

  /**
   * 解密
   * @param {string} algorithm 加密算法
   * @param {string} content 加密内容
   * @param {string} content 加密密钥
   * @param {Encoding} format 格式
   */
  decrypt = (algorithm: string, content: string, key: string, format: Encoding) => {
    const cryptkey = createHash('sha256').update(key).digest();
    const decipher = createDecipheriv(algorithm, cryptkey, 'nr_middle_server');
    decipher.update(content, 'base64', format);
    return decipher.final('utf8');
  };

  /**
   * token加密
   * @param {string} algorithm 加密算法
   * @param {string} content 加密内容
   * @param {string} content 加密密钥
   * @param {Encoding} format 格式
   */
  encryptToken = (algorithm: string, content: string, key: string, format: Encoding) => {
    const cryptkey = createHash('sha256').update(key).digest();
    const decipher = createCipheriv(algorithm, cryptkey, 'nr_middle_server');
    decipher.update(content, format, 'base64');
    return decipher.final('base64');
  };

  /**
   * token解析
   * @param token
   */
  parseToken = (token: string) => this.decrypt('aes-256-cbc', token, 'esoft', 'utf8').split('.');

  /**
   * md5加密
   * @param content 加密内容
   */
  md5 = (content: string) => this.encrypt('md5', content, 'utf8');

  /**
   * 加密密码
   *
   * @param {string} password 密码
   */
  encryptPassword = async (password: string): Promise<string> => await argon2.hash(password);

  /**
   * 检查密码是否正确
   *
   * @param {string} hash 加密后的密码
   * @param {string} password 密码
   */
  checkPassword = async (hash: string, password: string): Promise<boolean> =>
    await argon2.verify(hash, password);
}
