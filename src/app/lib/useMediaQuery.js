function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// import React from 'react';

// export default function useMediaQuery(query) {
//   const [matches, setMatches] = React.useState(false);
//   React.useEffect(() => {
//     const matchQueryList = window.matchMedia(query);
//     function handleChange(e) {
//       setMatches(e.matches);
//     }
//     matchQueryList.addEventListener('change', handleChange);
//     return () => {
//       matchQueryList.removeEventListener('change', handleChange);
//     };
//   }, [query]);
//   return matches;
// }
