import React, { useState, useEffect, useCallback, memo } from 'react';

import { message } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';

import BLTableInfo from './components/BL-table-info';
import * as APIS from '@constants/api-constants';

interface ILegislativeSubject {
  uuid: string;
  subject: string;
}
interface IRelationship {
  uuid: string;
  number: string;
  legislativeSubject: ILegislativeSubject[];
}
interface IProp {
  billNumber: string;
  billCongress: number;
}

export default memo(({ billNumber, billCongress }: IProp) => {
  const [relationship, setRelationship] = useState<IRelationship[]>([]);
  const [page, setPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [relationshipFetch, setRelationshipFetch] = useState(false);
  const [needFetch, setNeedFetch] = useState(false);

  const searchRelationship = useCallback(
    debounce(
      async (
        billNumber: string,
        billCongress: number,
        pageSize: number,
        page: number
      ) => {
        if (billNumber && billCongress) {
          setRelationshipFetch(true);
          let { data } = await axios.get(
            APIS.QUERY_BILL_AND_LEGISLATIVE_SUBJECTS,
            {
              params: {
                billNumber,
                billCongress,
                pageSize,
                page,
              },
            }
          );

          setRelationship(data.data);
          setTotalNum(data.totalNum);
          setRelationshipFetch(false);
          setNeedFetch(false);
          message.success(`数据查询成功,共${data.totalNum}条`);
        }
      },
      800
    ),
    []
  );

  // 重置页数
  useEffect(() => {
    setPage(1);
  }, [billNumber, billCongress]);

  useEffect(() => {
    setNeedFetch(true);
  }, [billNumber, billCongress, pageSize, page]);

  useEffect(() => {
    if (needFetch) {
      searchRelationship(billNumber, billCongress, pageSize, page);
    }
  }, [searchRelationship, billNumber, billCongress, pageSize, page, needFetch]);

  return (
    <BLTableInfo
      page={page}
      relationship={relationship}
      relationshipFetch={relationshipFetch}
      totalNum={totalNum}
      onPageChange={(page: number) => setPage(page)}
      pageSize={pageSize}
      onPageSizeChange={(pageSize: number) => setPageSize(pageSize)}
    />
  );
});
