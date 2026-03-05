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
            platform: 'base', // 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
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
                "param_image_label4": "素材4",
                "param_image_label5": "素材5",
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
            key: 'imageUrl4',
            label: `${t('param_image_label4')}`,
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
            label: `${t('param_image_label5')}`,
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
        // , temperature, top_p, top_K, candidateCount
        const { imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, prompt, model, temperature, top_p, top_K, candidateCount } = formItemParams;
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
            // 收集所有图片字段
            const imageFields = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
            const tmpUrls = [];
            for (const imageField of imageFields) {
                // 每个imageField是一个图片数组，可能包含多张图片
                if (Array.isArray(imageField)) {
                    for (const image of imageField) {
                        if (image?.tmp_url) {
                            tmpUrls.push(image.tmp_url);
                        }
                    }
                }
            }
            if (tmpUrls.length === 0) {
                throw new Error('No image URLs found');
            }
            // 2. 调用新的接口 api/sysChatChannel/imagebuilderchat
            const url = 'https://saas.jcbbi.com:8180/api/sysChatChannel/imagebuilderchat';
            const requestBody = {
                "Model": "gemini-3-pro-image-preview",
                "content": prompt,
                "imageUrls": tmpUrls,
                "temperature": Number(temperature),
                "topP": Number(top_p),
                "topK": Number(top_K),
                "candidateCount": Number(candidateCount),
            };
            const headers = {
                'Content-Type': 'application/json',
            };
            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            };
            // 直接使用context.fetch
            const res = await context.fetch(url, init, 'auth_id');
            debugLog({ '===响应内容': res });
            const resJson = await res.json();
            const uploadedImages = [];
            if (resJson.code === 200 && resJson.result && resJson.result.imageUrl) {
                uploadedImages.push({
                    "name": `${model}.png`,
                    "content": resJson.result.imageUrl,
                    "contentType": "attachment/url",
                });
            }
            else {
                throw new Error('API call failed with code: ' + resJson.code);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLGtCQUFrQixFQUFFLG1DQUFtQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUUvSyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGNBQWMsRUFBRTtRQUNkO1lBQ0UsRUFBRSxFQUFFLFNBQVMsRUFBQyx5Q0FBeUM7WUFDdkQsUUFBUSxFQUFFLE1BQU0sRUFBQyw4REFBOEQ7WUFDL0UsSUFBSSxFQUFFLDRDQUFpQixDQUFDLGlCQUFpQjtZQUN6QyxRQUFRLEVBQUUsS0FBSyxFQUFDLHdDQUF3QztZQUN4RCxlQUFlLEVBQUUsdUJBQXVCLEVBQUMseUJBQXlCO1lBQ2xFLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSw4REFBOEQ7Z0JBQ3JFLElBQUksRUFBRSw4REFBOEQ7YUFDckU7U0FDRjtLQUNGO0lBQ0QsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixt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