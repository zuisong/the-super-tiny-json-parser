// 工具方法 校验用
export function required<T>(
  t: T,
  fn: (t: T) => Boolean,
  message: string = ""
): T {
  if (!fn(t)) {
    throw new Error(message);
  }
  return t;
}
