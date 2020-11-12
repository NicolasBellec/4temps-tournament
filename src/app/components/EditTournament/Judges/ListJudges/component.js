// @flow

import React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableRow,
} from 'semantic-ui-react';

import type { Props } from './types';

function ListJudges({ judges }: Props) {
  return (
    <Table unstackable basic="very">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Access Key</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {judges.map((j) => {
          if (j.data && j.accessKey) {
            return (
              <TableRow key={j.data.id}>
                <TableCell>{j.data.name}</TableCell>
                <TableCell>{typeToDisplayName(j.data.judgeType)}</TableCell>
                <TableCell>{j.accessKey}</TableCell>
              </TableRow>
            );
          }
        })}
      </TableBody>
    </Table>
  );
}

function typeToDisplayName(judgeType: JudgeType): string {
  if (judgeType === 'normal') {
    return 'Normal';
  }
  if (judgeType === 'sanctioner') {
    return 'Sanctioner';
  }
  if (judgeType === 'president') {
    return 'President';
  }
  return 'Unknown';
}

export default ListJudges;
