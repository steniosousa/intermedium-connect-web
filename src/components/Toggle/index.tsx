import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../hooks/ThemeContext';
import { LuSun } from "react-icons/lu";
import { FaMoon } from "react-icons/fa";

export default function Toggle() {
    const { theme, setTheme } = useContext(ThemeContext);
    const [themeIcon, setThemeIcon] = useState(false)

    const hadleThemeIcon = () => {
        setThemeIcon(!themeIcon)
    }
    return (
        <div className='text-2xl'>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {
                    (themeIcon === false) ? <LuSun onClick={hadleThemeIcon}/>:
                    <FaMoon onClick={hadleThemeIcon}/>
                }
            </button>
        </div>
    );
}