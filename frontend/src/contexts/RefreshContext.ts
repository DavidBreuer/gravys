import { createContext } from "react";

export const RefreshContext = createContext({ version: 0, bump: () => {} });
