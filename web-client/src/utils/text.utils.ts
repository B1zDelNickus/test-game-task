export class TextUtils {

    static wrapText(text: string): string[] {

        const words = text.split(" ");
        const result: string[] = [];

        let temp = "";
        words.forEach((word, index) => {
            temp += word + " ";
            if (null == words[index + 1] || temp.length + words[index + 1].length > 35) {
                result.push(temp);
                temp = "";
            }
        });

        return result;
    }

}