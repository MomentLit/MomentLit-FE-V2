const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/;

/**
 * 백엔드가 timezone 표기 없이 UTC 시각을 내려주는 경우(`Z`/offset 없음) JS의 `new Date()`가
 * 이를 로컬 시간으로 오인해서 실제 시간과 어긋난다. timezone 표기가 없을 때만 `Z`를 붙여 UTC로 해석한다.
 */
export const parseServerDate = (value: string): Date =>
  new Date(HAS_TIMEZONE.test(value) ? value : `${value}Z`);
