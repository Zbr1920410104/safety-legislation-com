import React, { useState } from 'react';

import axios from 'axios';
import debounce from 'lodash.debounce';

import * as APIS from '@constants/api-constants';
import SelectInfo from '../select-info/Select-info';

interface IProp {
  onPolicyAreaChange: Function;
}
interface ISelectOption {
  key: string;
  value: string;
  text: string;
}

export default ({ onPolicyAreaChange }: IProp) => {
  const [options, setOptions] = useState<ISelectOption[]>([]);
  const [selectFetch, setSelectFetch] = useState(false);

  const optionDataPack = (data: { policyArea: string }[]): ISelectOption[] => {
    return data.map(item => {
      return {
        key: item.policyArea,
        value: item.policyArea,
        text: item.policyArea,
      };
    });
  };

  const selectSearch = debounce(async (name: string) => {
    if (!name) return;
    setSelectFetch(true);
    let res = await axios.get(APIS.QUERY_POLICY_AREA_LIST, {
      params: {
        name,
        max: 5,
      },
    });

    let options = optionDataPack(res.data);
    setOptions(options);
    setSelectFetch(false);
  }, 800);

  return (
    <SelectInfo
      options={options}
      selectFetch={selectFetch}
      selectSearch={selectSearch}
      onUuidChange={onPolicyAreaChange}
      placeholder='请输入要查询的政策领域'
      tooltipValue='如: International Affairs'
    />
  );
};
