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
            id: 'auth_id', // 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
            platform: '毛毛虫', // 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
            type: block_basekit_server_api_1.AuthorizationType.HeaderBearerToken,
            required: false, // 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
            instructionsUrl: "https://www.mmcjt.cn/", // 帮助链接，告诉使用者如何填写这个apikey
            label: '授权',
            icon: {
                light: 'https://saas.jcbbi.com/upload/2026/01/29/767965034025029.jpg',
                dark: 'https://saas.jcbbi.com/upload/2026/01/29/767965034025029.jpg'
            }
        }
    ],
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                "param_image_label": "素材1",
                "param_image_label2": "素材2",
                "param_image_label3": "素材3",
                "param_prompt_label": "提示词",
                "param_model_label": "型号",
                "param_temperature_label": "Temperature",
                "param_top_p_label": "topP",
                "param_top_K_label": "topK",
                "param_candidateCount_label": "candidateCount",
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
            label: `${t('param_image_label2')}`,
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
            label: `${t('param_image_label3')}`,
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
        {
            key: 'temperature',
            label: t('param_temperature_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入0.0-2.0之间数字',
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'top_p',
            label: t('param_top_p_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入0.0-1.0之间数字',
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'top_K',
            label: t('param_top_K_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入10-100之间数字',
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'candidateCount',
            label: t('param_candidateCount_label'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入1-8之间数字',
            },
            validator: {
                required: false,
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
        const { imageUrl1, imageUrl2, imageUrl3, prompt, model, temperature, top_p, top_K, candidateCount } = formItemParams;
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
            const imageFields = [imageUrl1, imageUrl2, imageUrl3];
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
                'Authorization': 'Bearer Bvvw1Y5LRwNnzTIe2446Ed1802E5472b81AaDdF0Cd3fBa3a'
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
                // "temperature": Number(temperature),
                // "topP": Number(top_p),
                // "topK": Number(top_K),
                // "candidateCount": Number(candidateCount),
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
            const res = await context.fetch(url, init, 'auth_id');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLGtCQUFrQixFQUFFLG1DQUFtQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUUvSyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGNBQWMsRUFBRTtRQUNkO1lBQ0UsRUFBRSxFQUFFLFNBQVMsRUFBQyx5Q0FBeUM7WUFDdkQsUUFBUSxFQUFFLEtBQUssRUFBQyw4REFBOEQ7WUFDOUUsSUFBSSxFQUFFLDRDQUFpQixDQUFDLGlCQUFpQjtZQUN6QyxRQUFRLEVBQUUsS0FBSyxFQUFDLHdDQUF3QztZQUN4RCxlQUFlLEVBQUUsdUJBQXVCLEVBQUMseUJBQXlCO1lBQ2xFLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSw4REFBOEQ7Z0JBQ3JFLElBQUksRUFBRSw4REFBOEQ7YUFDckU7U0FDRjtLQUNGO0lBQ0QsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixtQkFBbUIsRUFBRSxJQUFJO2dCQUN6Qix5QkFBeUIsRUFBRSxhQUFhO2dCQUN4Qyxt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