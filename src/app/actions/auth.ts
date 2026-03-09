"use server";

/**
 * 验证管理员密码
 * @param password 用户输入的密码
 */
export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // 如果没有配置环境变量，默认拒绝所有修改操作
    return { success: false, error: "服务器未配置管理员密码，请联系管理员" };
  }

  if (password === adminPassword) {
    return { success: true };
  }

  return { success: false, error: "管理员密码错误" };
}
