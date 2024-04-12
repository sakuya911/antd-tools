/**
 * @file
 * 主要用作判断当前使用主题
 */

import { markdownRegex } from "../const";
import { useCallback, useEffect, useRef } from 'React';

const useThemeHook = (markdownText: string) => {
  const theme = useRef('default');
  const updateTheme = useCallback(() => {
    // 通过session比对判断当前主题是否有改动，若有改动则更新主题文件
    if (window.sessionStorage.getItem('nowTheme') !== theme.current) {
      // 先判断head标签中有无已读取的主题样式文件，若有则删除
      const docHead = document.head;
      const linkList = document.getElementsByTagName('link');
      if (linkList) {
        for (let i = 0; i < linkList.length; i++) {
          if (linkList[i].getAttribute('title') === 'nowTheme') {
            docHead.removeChild(linkList[i]);
          }
        }
      }

      // 如果存在主题，读取相关主题文件
      if (theme.current) {
        // 读取相应主题样式文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.title = 'nowTheme';
        link.href = `../src/styleThemes/${theme.current}.scss`;
        document.head.appendChild(link);
        window.sessionStorage.setItem('nowTheme', theme.current);
      }
    }
  }, [theme]);

  const getTheme = useCallback(() => {
    const themesList = markdownText?.match(markdownRegex.themeArea)?.[1]?.split('\n');
    const themes = themesList?.find(one => markdownRegex.themeText.test(one));
    if (themes) {
      const cleanedTheme = themes.split(':')[1]?.trim();
      theme.current = cleanedTheme || '';
    } else {
      theme.current = 'default';
    }
  }, [markdownText]);

  useEffect(() => {
    getTheme();
    updateTheme();
  }, [getTheme, updateTheme]);

  return { updateTheme };
};

export default useThemeHook;