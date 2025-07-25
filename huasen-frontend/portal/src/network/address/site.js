/*
 * @Autor: huasenjio
 * @Date: 2022-10-22 10:49:51
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-03-19 14:13:30
 * @Description: Site
 */

import Mock from 'mockjs2';
import { get, post } from '../request.js';

const findSiteByCode = post('/site/findByCode');
const findSiteDetail = post('/site/findSiteDetail');
export default {
  findSiteByCode,
  findSiteDetail,
};
