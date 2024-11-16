export const fileFormat = (url) => {
    const fileExtension = url.split(".").pop();

    if (
        fileExtension === "mp4" ||
        fileExtension === "webm" ||
        fileExtension === "ogg"
    ) {
        return "video";
    }

    if (
        fileExtension === "mp3" ||
        fileExtension === "wav"
    ) {
        return "audio";
    }

    if (
        fileExtension === "png" ||
        fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "gif"
    ) {
        return "image";
    }

    return "file";
};

export const transformImage = (url = "", width = 100) => url;


export const getOrSaveFromStorage = ({ key, val, get }) => {
    if (get) {
        const storedValue = localStorage.getItem(key);
        
        // Return null if storedValue is null or undefined
        if (storedValue === null || storedValue === undefined) {
            return null;
        }

        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
            return null;  // Return null if parsing fails
        }
    } else {
        localStorage.setItem(key, JSON.stringify(val));
    }
};



