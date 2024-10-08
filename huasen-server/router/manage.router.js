/*
 * @Autor: huasenjio
 * @Date: 2022-10-02 00:24:33
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-03-25 16:54:01
 * @Description: 管理员路由
 */
const express = require('express');
const router = express.Router();

const { login, add, findAllByPage, update, remove, overview, visitor, diskOverview, uvOverview, config, executeRuntimeCode, findAppConfig, saveAppConfig, findAppFavicon, uploadFileToStore } = require('../controller/manage.controller.js');

const { checkManagePower, checkManageAccountUnique, checkManageHighestPower } = require('../middleware/manage.middleware.js');
const { handleUselessParams } = require('../middleware/common.middleware.js');
const { handleJWT } = require('../middleware/common.middleware.js');

router.post('/login', login);
router.post('/upload', handleJWT, checkManagePower, uploadFileToStore);
router.post('/uploadIcon', handleJWT, checkManagePower, uploadFileToStore);
router.post('/add', handleJWT, checkManagePower, checkManageHighestPower, checkManageAccountUnique, handleUselessParams, add);
router.post('/findByPage', handleJWT, checkManagePower, findAllByPage);
router.post('/remove', handleJWT, checkManagePower, checkManageHighestPower, remove);
router.post('/update', handleJWT, checkManagePower, update);

router.post('/overview', handleJWT, checkManagePower, overview);
router.post('/diskOverview', handleJWT, checkManagePower, diskOverview);
router.post('/uvOverview', handleJWT, checkManagePower, uvOverview);
router.post('/visitor', handleJWT, checkManagePower, visitor);

router.post('/executeRuntimeCode', handleJWT, checkManagePower, checkManageHighestPower, executeRuntimeCode);
router.post('/saveAppConfig', handleJWT, checkManagePower, checkManageHighestPower, saveAppConfig);
router.post('/findAppFavicon', handleJWT, checkManagePower, findAppFavicon);
router.post('/findAppConfig', handleJWT, checkManagePower, findAppConfig);

module.exports = router;
