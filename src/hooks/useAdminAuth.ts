"use client";

import { useCallback, useState } from "react";
import { verifyAdminPassword } from "@/app/actions/auth";

export function useAdminAuth() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  /**
   * 检查权限并在验证通过后执行操作
   * @param onSuccess 验证通过后要执行的回调函数
   */
  const withAdminAuth = useCallback(async (onSuccess: () => void) => {
    const storedPassword = localStorage.getItem("admin_password");

    if (storedPassword) {
      try {
        const result = await verifyAdminPassword(storedPassword);
        if (result.success) {
          onSuccess();
          return;
        }
        // 如果存储的密码失效，清除它
        localStorage.removeItem("admin_password");
      } catch (e) {
        console.error("Admin verification error:", e);
      }
    }

    // 如果没有存储密码或验证失败，打开对话框
    setPendingAction(() => onSuccess);
    setIsDialogOpen(true);
  }, []);

  /**
   * 处理验证成功后的回调
   * @param password 验证成功的密码
   */
  const handleVerified = useCallback(
    (password: string) => {
      localStorage.setItem("admin_password", password);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    },
    [pendingAction],
  );

  return {
    isDialogOpen,
    setIsDialogOpen,
    withAdminAuth,
    handleVerified,
  };
}
