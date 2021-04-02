import React, { useState, createContext, useContext } from 'react'

import detectBrowserLanguage from 'detect-browser-language'

import { languageOptions, dictionaryList } from 'resources/languages/FileLanguageIndex.js'

const getBroserLanguage = () => {
  let detected = detectBrowserLanguage();
  detected = detected.substring(0, 2);
  return detected;
} 

const browserLanguage = dictionaryList[getBroserLanguage()] ? getBroserLanguage() : 'en';

// create the language context with default selected language
export const LanguageContext = createContext({
  userLanguage: browserLanguage,
  dictionary: dictionaryList[browserLanguage]
});

// it provides the language context to app
export function LanguageProvider({ children }) {
  const [userLanguage, setUserLanguage] = useState(browserLanguage);

  const provider = {
    userLanguage,
    dictionary: dictionaryList[userLanguage],
    userLanguageChange: selected => {
      const newLanguage = languageOptions[selected] ? selected : browserLanguage;
      setUserLanguage(newLanguage);
      window.localStorage.setItem('rcml-lang', newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
};

// get text according to id & current language
export function Text({ tid }) {
  const languageContext = useContext(LanguageContext);
  return languageContext.dictionary[tid] || tid;
};