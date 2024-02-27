import React from 'react';
import ComboBox from '../components/ComboBox';

export default function NewCityComboBox({ cities, onCitySelect, value }) {
  return (
    <ComboBox
      dataList={cities.map((city) => ({ value: city, label: city }))}
      onSelect={onCitySelect}
      placeholder='Select a City...'
      value={value}
    />
  );
}

// import React from 'react';
// import ComboBox from '../components/ComboBox';

// export default function CityComboBox({ cities, onCitySelect, value }) {
//   return (
//     <ComboBox
//       dataList={cities.map((city) => ({ value: city, label: city }))}
//       onSelect={onCitySelect}
//       placeholder='Select a City...'
//       value={value}
//     />
//   );
// }
