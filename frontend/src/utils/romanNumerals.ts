export function toRoman(num: number): string {
    if(num < 1) { return "";}
    if(num >= 40) { return "XL" + toRoman(num - 40);}
    if(num >= 10) { return "X" + toRoman(num - 10);}
    if(num >= 9) { return "IX" + toRoman(num - 9);}
    if(num >= 5) { return "V" + toRoman(num - 5);}
    if(num >= 4) { return "IV" + toRoman(num - 4);}
    if(num >= 1) { return "I" + toRoman(num - 1);}
    return "";
  }