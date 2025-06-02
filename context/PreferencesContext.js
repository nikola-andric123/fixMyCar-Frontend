import { createContext, useState } from "react";

export const PreferencesContext = createContext(null);
export default function PreferencesProvider({children}) {

    const [COLORS, setColors] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState('forestTheme')

    return (
        <PreferencesContext.Provider value={{COLORS, setColors,  selectedTheme, setSelectedTheme}}>
            {children}
        </PreferencesContext.Provider>
    )
}