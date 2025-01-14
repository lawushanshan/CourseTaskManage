import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

export function useToast() {
  const [messageApi, contextHolder] = message.useMessage();

  return {
    toast: messageApi,
    ToastProvider: () => contextHolder,
  };
} 