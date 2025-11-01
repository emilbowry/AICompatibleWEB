// server/src/utils/uuid.ts

import { randomUUID } from "crypto";

const generateUUID = (): string => {
	return randomUUID();
};

export { generateUUID };
