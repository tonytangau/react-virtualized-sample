import React, { PureComponent } from 'react';
import faker from 'faker';
import _sortBy from 'lodash/sortBy';
import { Column, Table, AutoSizer, SortDirection } from 'react-virtualized';

const data = [...Array(1000)].map((val, i) => (
  {
    key: i, 
    name: faker.name.findName(), 
    company: faker.company.companyName(),
    phone: faker.phone.phoneNumber()
  })
);

export default class VirtualTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tableData: data
    };

    this.updateSort = this.updateSort.bind(this);
  }

  componentWillUpdate (nextProps, nextState) {
    const {
      sortBy: prevSortBy,
      sortDirection: prevSortDirection
    } = this.state;

    if (nextState.sortBy !== prevSortBy || nextState.sortDirection !== prevSortDirection) {
      const { sortBy, sortDirection } = nextState;

      let { tableData } = this.state;
      let sortedTableData = [...tableData];

      if (sortBy) {
        sortedTableData = _sortBy(sortedTableData, item => item[sortBy]);
        if (sortDirection === SortDirection.DESC) {
          sortedTableData = sortedTableData.reverse()
        }
      }

      this.setState({ tableData: sortedTableData });
    }
  }

  updateSort ({ sortBy, sortDirection }) {
    const {
      sortBy: prevSortBy,
      sortDirection: prevSortDirection
    } = this.state;

    if (prevSortBy !== sortBy) {
      sortDirection = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.DESC) {
      sortBy = null;
      sortDirection = null;
    }

    this.setState({ sortBy, sortDirection });
  }

  render() {
    const { tableData, sortBy, sortDirection } = this.state;

    return (
      <AutoSizer className="auto-sizer">
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            headerHeight={20}
            rowHeight={30}
            rowCount={tableData.length}
            rowGetter={({ index }) => tableData[index]}
            sort={this.updateSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
          >
            <Column
              width={200}
              dataKey='name'
              label='Name'
            />
            <Column
              width={300}
              dataKey='company'
              label='Company'
            />
            <Column
              width={200}
              dataKey='phone'
              label='Phone'
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}
