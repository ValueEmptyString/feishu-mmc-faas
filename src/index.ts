import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'api.example.com', '121.40.190.107', 'dashscope.aliyuncs.com', 'api.ezlinkai.com', 'generativelanguage.googleapis.com', 'saas.jcbbi.com']);

basekit.addField({
  authorizations: [
    {
      id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
      platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
      type: AuthorizationType.HeaderBearerToken,
      required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
      instructionsUrl: "https://www.saas.jcbbi.com/",// 帮助链接，告诉使用者如何填写这个apikey
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'imageUrl2',
      label: `${t('param_image_label')}`,
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'imageUrl3',
      label: `${t('param_image_label')}`,
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'imageUrl4',
      label: `${t('param_image_label')}`,
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'imageUrl5',
      label: `${t('param_image_label')}`,
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'prompt',
      label: t('param_prompt_label'),
      component: FieldComponent.Input,
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
      component: FieldComponent.Input,
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
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    // 获取入参 - 开发者可以根据自己的字段配置获取相应参数
    const { imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, prompt, model } = formItemParams;

    /** 
     * 为方便查看日志，使用此方法替代console.log
     * 开发者可以直接使用这个工具函数进行日志记录
     */
    function debugLog(arg: any, showContext = false) {
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
      const base64Images: Array<{ mime_type: string, data: string }> = [];
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
                } catch (error) {
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
      const requestBody: any = {
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
      let editedImageUrls: string[] = [];

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
      } catch (e) {
        debugLog({ '===读取响应错误': e });
        editedImageUrls = [];
      }

      // debugLog({ '===最终编辑图片URLs': editedImageUrls });
      // 生成6位随机数
      function generateNonce(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }
      
      // 生成签名
      function generateSign(method: string, url: string, accessKey: string, timestamp: string, nonce: string, accessSecret: string): string {
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
            } else {
              throw new Error('Upload failed with code: ' + uploadResult.code);
            }
          }
        } catch (error) {
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
        code: FieldCode.Success,
        data: uploadedImages,
      };
    } catch (e) {
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
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;