"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.example.com', '121.40.190.107', 'dashscope.aliyuncs.com', 'api.ezlinkai.com', 'generativelanguage.googleapis.com', 'saas.jcbbi.com']);
block_basekit_server_api_1.basekit.addField({
    authorizations: [
        {
            id: 'auth_id_1', // 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
            platform: 'baidu', // 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
            type: block_basekit_server_api_1.AuthorizationType.HeaderBearerToken,
            required: false, // 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
            instructionsUrl: "https://www.saas.jcbbi.com/", // 帮助链接，告诉使用者如何填写这个apikey
            label: '测试授权',
            icon: {
                light: '',
                dark: ''
            }
        }
    ],
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                "param_image_label": "图片",
                "param_prompt_label": "提示词",
                "param_model_label": "型号",
            },
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'imageUrl1',
            label: `${t('param_image_label')}`,
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'imageUrl2',
            label: `${t('param_image_label')}`,
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'imageUrl3',
            label: `${t('param_image_label')}`,
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'imageUrl4',
            label: `${t('param_image_label')}`,
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'imageUrl5',
            label: `${t('param_image_label')}`,
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'prompt',
            label: t('param_prompt_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入图片编辑指令',
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'model',
            label: t('param_model_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入型号',
            },
            validator: {
                required: true,
            }
        },
    ],
    // 定义捷径的返回结果类型，直接返回编辑后的图片
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        // 获取入参 - 开发者可以根据自己的字段配置获取相应参数
        const { imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, prompt, model } = formItemParams;
        /**
         * 为方便查看日志，使用此方法替代console.log
         * 开发者可以直接使用这个工具函数进行日志记录
         */
        function debugLog(arg, showContext = false) {
            // @ts-ignore
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }), '\n');
        }
        // 入口第一行日志，展示formItemParams和context，方便调试
        // 每次修改版本时，都需要修改日志版本号，方便定位问题
        debugLog('=====start=====v1', true);
        try {
            // 1. 调用Gemini API
            const url = 'https://api.ezlinkai.com/v1beta/models/gemini-3-pro-image-preview:generateContent';
            // 收集所有图片字段
            const imageFields = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
            // 转换所有临时URL为base64
            const base64Images = [];
            for (const imageField of imageFields) {
                // 每个imageField是一个图片数组，可能包含多张图片
                if (Array.isArray(imageField)) {
                    for (const image of imageField) {
                        if (image?.tmp_url) {
                            const tmpUrl = image.tmp_url;
                            if (tmpUrl) {
                                try {
                                    // Fetch the image from the temporary URL
                                    const imageResponse = await context.fetch(tmpUrl);
                                    const arrayBuffer = await imageResponse.arrayBuffer();
                                    // Convert ArrayBuffer to Buffer
                                    const buffer = Buffer.from(arrayBuffer);
                                    // Convert Buffer to base64 string without data URI prefix
                                    const base64 = buffer.toString('base64');
                                    const contentType = image.type || 'image/png';
                                    base64Images.push({
                                        mime_type: contentType,
                                        data: base64
                                    });
                                }
                                catch (error) {
                                    debugLog({ '===转换base64错误': String(error) });
                                }
                            }
                        }
                    }
                }
            }
            debugLog({ '===转换后的base64图片数量': base64Images.length });
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer vSECfXfc7PQiB3Ap2029936eE83349878b0aE0F82b76D228'
            };
            // Build request payload according to the provided curl example - text first, then images
            const requestBody = {
                model: "gemini-2.5-flash-image-preview",
                "contents": [{
                        "role": "user",
                        "parts": [
                            { "text": prompt }
                        ]
                    }],
                "generationConfig": {
                    "responseModalities": ["TEXT", "IMAGE"]
                }
            };
            // Add all base64 images after the text prompt
            base64Images.forEach(image => {
                requestBody.contents[0].parts.push({
                    "inline_data": {
                        "mime_type": image.mime_type,
                        "data": image.data
                    }
                });
            });
            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            };
            // 使用封装的fetch函数，确保日志记录完整
            // debugLog({ '===请求参数': init });
            // debugLog({ '===请求参数': JSON.stringify(requestBody, null, 2) });
            // 直接使用context.fetch
            const res = await context.fetch(url, init, 'auth_id_1');
            // debugLog({ '===响应内容': res });
            // debugLog({ '===响应状态': res.status });
            // 2. 处理响应
            let editedImageUrls = [];
            try {
                const resJson = await res.json();
                debugLog({ '===完整响应': resJson });
                // 解析响应，获取编辑后的图片URL
                if (resJson.candidates && resJson.candidates[0] && resJson.candidates[0].content) {
                    const content = resJson.candidates[0].content;
                    if (Array.isArray(content.parts)) {
                        // 查找所有图片类型的内容 - 使用正确的 camelCase 属性名
                        const imageContents = content.parts.filter(item => item.inlineData);
                        // 收集所有图片URL
                        if (imageContents.length > 0) {
                            editedImageUrls = imageContents.map(item => {
                                if (item.inlineData) {
                                    const { mimeType, data } = item.inlineData;
                                    return `data:${mimeType};base64,${data}`;
                                }
                                return '';
                            }).filter(url => url); // 过滤掉空URL
                        }
                    }
                }
            }
            catch (e) {
                debugLog({ '===读取响应错误': e });
                editedImageUrls = [];
            }
            // debugLog({ '===最终编辑图片URLs': editedImageUrls });
            // 生成6位随机数
            function generateNonce() {
                return Math.floor(100000 + Math.random() * 900000).toString();
            }
            // 生成签名
            function generateSign(method, url, accessKey, timestamp, nonce, accessSecret) {
                // 处理url，去除协议、域名、参数，以/开头
                const path = url.replace(/^https?:\/\/[^\/]+/, '').split('?')[0];
                // 按照顺序拼接参数
                const str = `${method.toUpperCase()}&${path}&${accessKey}&${timestamp}&${nonce}`;
                // 使用HMAC-SHA256计算签名
                const hmac = require('crypto').createHmac('sha256', accessSecret);
                const signData = hmac.update(str).digest('base64');
                return signData;
            }
            // 3. 上传生成的图片到外部存储API
            const uploadedImages = [];
            for (const [index, url] of editedImageUrls.entries()) {
                try {
                    // 解析base64 data URI
                    const dataUriRegex = /^data:(.+);base64,(.+)$/;
                    const match = url.match(dataUriRegex);
                    if (match) {
                        const [, mimeType, base64Data] = match;
                        const fileExtension = mimeType.split('/')[1];
                        const fileName = `generated-${index + 1}.${fileExtension}`;
                        // 上传API配置
                        const uploadUrl = 'https://saas.jcbbi.com:8180/api/sysFile/uploadFileFromBase64';
                        const accessKey = 'mmcimages';
                        const accessSecret = '0Gs18sWyIEiL5Y9mh6cpqQ';
                        const method = 'POST';
                        const timestamp = Math.floor(Date.now() / 1000).toString();
                        const nonce = generateNonce();
                        // 生成签名
                        const sign = generateSign(method, uploadUrl, accessKey, timestamp, nonce, accessSecret);
                        // 调用上传API
                        const uploadResponse = await context.fetch(uploadUrl, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'accessKey': accessKey,
                                'timestamp': timestamp,
                                'nonce': nonce,
                                'sign': sign
                            },
                            body: JSON.stringify({
                                "fileDataBase64": `data:${mimeType};base64,${base64Data}`,
                                "fileName": fileName,
                                "contentType": mimeType
                            })
                        });
                        const uploadResult = await uploadResponse.json();
                        debugLog({ '===上传结果': uploadResult });
                        if (uploadResult.code === 200 && uploadResult.result) {
                            // 拼接完整URL
                            const fullUrl = `https://saas.jcbbi.com/${uploadResult.result.url}`;
                            uploadedImages.push({
                                "name": `${model}.png`,
                                "content": fullUrl,
                                "contentType": "attachment/url",
                            });
                        }
                        else {
                            throw new Error('Upload failed with code: ' + uploadResult.code);
                        }
                    }
                }
                catch (error) {
                    debugLog({ '===上传图片错误': String(error) });
                    // fallback: use original URL if upload fails
                    uploadedImages.push({
                        "name": `${model}.png`,
                        "content": url,
                        "contentType": "image/png",
                    });
                }
            }
            // 返回上传后的图片结果
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: uploadedImages,
            };
        }
        catch (e) {
            // 4. 捕获未知错误 - 系统异常时的处理
            debugLog({
                '===999 未知错误': String(e)
            });
            /**
             * 返回非 Success 的错误码，将会在单元格上显示报错
             * 请勿返回msg、message之类的字段，它们并不会起作用
             * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因
             */
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLGtCQUFrQixFQUFFLG1DQUFtQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUUvSyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGNBQWMsRUFBRTtRQUNkO1lBQ0UsRUFBRSxFQUFFLFdBQVcsRUFBQyx5Q0FBeUM7WUFDekQsUUFBUSxFQUFFLE9BQU8sRUFBQyw4REFBOEQ7WUFDaEYsSUFBSSxFQUFFLDRDQUFpQixDQUFDLGlCQUFpQjtZQUN6QyxRQUFRLEVBQUUsS0FBSyxFQUFDLHdDQUF3QztZQUN4RCxlQUFlLEVBQUUsNkJBQTZCLEVBQUMseUJBQXlCO1lBQ3hFLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxtQkFBbUIsRUFBRSxJQUFJO2dCQUN6QixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixtQkFBbUIsRUFBRSxJQUFJO2FBQzFCO1NBQ0Y7S0FDRjtJQUNELFVBQVU7SUFDVixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLEtBQUssRUFBRSxHQUFH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