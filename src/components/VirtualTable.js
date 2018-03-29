import React, { PureComponent, Fragment } from 'react';
import faker from 'faker';
import _ from 'lodash';
import { Column, Table, AutoSizer, SortDirection } from 'react-virtualized';
import SearchApi from 'js-worker-search'

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
      tableData: data,
      indexes: _.map(data, d => d.key)
    };

    this.searchApi = new SearchApi();
    this.updateSort = this.updateSort.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      sortBy: prevSortBy,
      sortDirection: prevSortDirection
    } = this.state;

    if (nextState.sortBy !== prevSortBy || nextState.sortDirection !== prevSortDirection) {
      const { sortBy, sortDirection } = nextState;

      let { tableData } = this.state;
      let sortedTableData = [...tableData];

      if (sortBy) {
        sortedTableData = _.sortBy(sortedTableData, item => item[sortBy]);
        if (sortDirection === SortDirection.DESC) {
          sortedTableData = sortedTableData.reverse();
        }
      }

      this.setState({ tableData: sortedTableData });
    }
  }

  onSearch(e) {
    if (e.target.value.length > 0) {
      this.searchApi.search(e.target.value).then(indexes => this.setState({indexes}));
    } else {
      this.setState({indexes: _.map(data, d => d.key)});
    }
  }

  updateSort({ sortBy, sortDirection }) {
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
    const { tableData, sortBy, sortDirection, indexes } = this.state;

    tableData.forEach((row) => {
      const { key, ...rowData } = row;

      this.searchApi.indexDocument(key, _.values(rowData).join());
    });

    const rows = _.filter([...tableData], row => _.includes(indexes, row.key));

    return (
      <Fragment>
        <input type="text" placeholder="Start typing to search..." id="search" onChange={this.onSearch} />

        <AutoSizer className="auto-sizer">
          {({ height, width }) => (
            <Table
              height={height}
              width={width}
              headerHeight={20}
              rowHeight={30}
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
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
      </Fragment>
    );
  }
}
