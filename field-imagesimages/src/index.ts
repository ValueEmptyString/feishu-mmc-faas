import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'api.example.com', '121.40.190.107', 'dashscope.aliyuncs.com', 'api.ezlinkai.com', 'generativelanguage.googleapis.com', 'saas.jcbbi.com']);

basekit.addField({
  authorizations: [
    {
      id: 'auth_id',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
      platform: 'base',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
      type: AuthorizationType.HeaderBearerToken,
      required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
      instructionsUrl: "https://www.mmcjt.cn/",// 帮助链接，告诉使用者如何填写这个apikey
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
      label: `${t('param_image_label2')}`,
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
      label: `${t('param_image_label3')}`,
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
      label: `${t('param_image_label4')}`,
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
      label: `${t('param_image_label5')}`,
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
    {
      key: 'temperature',
      label: t('param_temperature_label'),
      component: FieldComponent.Input,
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
      component: FieldComponent.Input,
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
      component: FieldComponent.Input,
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
      component: FieldComponent.Input,
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
    type: FieldType.Attachment,
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
      // 收集所有图片字段
      const imageFields = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
      const tmpUrls: string[] = [];

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
      }else {
         throw new Error('API call failed with code: ' + resJson.code);
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