import React from 'react';
import ComboBox from '../components/ComboBox';
import stateList from '../data/stateList';

export default function StateComboBox({ onStateSelect }) {
  return (
    <ComboBox
      dataList={stateList}
      onSelect={onStateSelect}
      placeholder='Select a State...'
    />
  );
}
