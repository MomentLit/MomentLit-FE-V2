export {};

declare global {
  type DaumPostcodeAddressType = "R" | "J";

  interface DaumPostcodeData {
    zonecode: string;
    address: string;
    addressEnglish: string;
    addressType: DaumPostcodeAddressType;
    userSelectedType: DaumPostcodeAddressType;
    roadAddress: string;
    roadAddressEnglish: string;
    jibunAddress: string;
    jibunAddressEnglish: string;
    autoRoadAddress: string;
    autoRoadAddressEnglish: string;
    autoJibunAddress: string;
    autoJibunAddressEnglish: string;
    buildingCode: string;
    buildingName: string;
    apartment: "Y" | "N";
    sido: string;
    sidoEnglish: string;
    sigungu: string;
    sigunguEnglish: string;
    sigunguCode: string;
    roadnameCode: string;
    bcode: string;
    roadname: string;
    roadnameEnglish: string;
    bname: string;
    bnameEnglish: string;
    bname1: string;
    bname1English: string;
    bname2: string;
    bname2English: string;
    hname: string;
    query: string;
  }

  interface DaumPostcodeOpenOptions {
    q?: string;
    left?: number;
    top?: number;
    popupTitle?: string;
    popupKey?: string;
    autoClose?: boolean;
  }

  interface DaumPostcodeEmbedOptions {
    q?: string;
    autoClose?: boolean;
  }

  interface DaumPostcodeOptions {
    oncomplete: (data: DaumPostcodeData) => void;
    onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
    onresize?: (size: { width: number; height: number }) => void;
    width?: number | string;
    height?: number | string;
  }

  interface DaumPostcodeInstance {
    open: (options?: DaumPostcodeOpenOptions) => void;
    embed: (element: HTMLElement, options?: DaumPostcodeEmbedOptions) => void;
  }

  interface Window {
    daum?: {
      Postcode: new (options: DaumPostcodeOptions) => DaumPostcodeInstance;
    };
  }
}
