// server/src/utils/uuid.ts
import { randomUUID } from "crypto";
const generateUUID = () => {
    return randomUUID();
};
export { generateUUID };
