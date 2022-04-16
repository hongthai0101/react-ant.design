/**
 * 公司单位
 */
 import React, { useEffect, useRef } from 'react'
 import useKeepState from 'use-keep-state'
 import Table from '@/components/table'
 import CreateCompanyModal from './CreateCompanyModal'
 import { serviceGetAllCompany, serviceDelCompany } from '@/services'
 import { Button, Popconfirm } from 'antd'
 import { fromNow } from '@/utils'
import { ICompany } from '@/models/company'
 
 interface State {
   showCreateCompanyModal: boolean
   detail: ICompany
 }
 
 const initialState: State = {
   showCreateCompanyModal: false,
   detail: {} as ICompany
 }
 
 const CompanyPage = () => {
   const [state, setState] = useKeepState(initialState)
   const tableRef = useRef<any>()
   const tableColumns = [
     {
       title: 'Company Name',
       dataIndex: 'name',
       width: 170
     },
     {
       title: 'Start Date',
       dataIndex: 'startDate',
       width: 130
     },
     {
       title: 'End Date',
       dataIndex: '__endDate__',
       width: 130,
     },
     {
       title: 'Expect Leave Date',
       dataIndex: 'expectLeaveDate',
       width: 130,
       render: (expectLeaveDate: any) => (
         expectLeaveDate > 0 ? (
           <div>
             {expectLeaveDate}
             <div>And {fromNow(Date.now(), expectLeaveDate)} Sky</div>
           </div>
         ) : null
       )
     },
     {
       title: 'Days in office',
       dataIndex: '__jobDay__',
       width: 100,
     },
     {
       title: 'Amount',
       dataIndex: '__amount__',
     },
     {
       title: 'Remark',
       dataIndex: 'remark',
       className: 'wbba'
     },
     {
       title: 'Operate',
       width: 170,
       align: 'right',
       fixed: 'right',
       render: (record: any) => (
         <>
           <Button onClick={() => handleEditCompany(record)}>Edit</Button>
           <Popconfirm
             title="Are you sure you want to delete it?"
             onConfirm={() => handleDelCompany(record)}
             placement="bottomLeft"
             okType="danger"
           >
             <Button>Delete</Button>
           </Popconfirm>
         </>
       )
     }
   ]
 
   function handleEditCompany(record: ICompany) {
     setState({ detail: record })
     toggleCreateCompanyModal()
   }
 
   async function handleDelCompany(record: any) {
     await serviceDelCompany(record.id)
     tableRef.current.getTableData()
   }
 
   function getAllCompany() {
     return serviceGetAllCompany()
   }
 
   function toggleCreateCompanyModal() {
     setState({ showCreateCompanyModal: !state.showCreateCompanyModal })
   }
 
   const handleSuccess = function() {
     toggleCreateCompanyModal()
     tableRef.current.getTableData()
   }
 
   useEffect(() => {
     tableRef?.current?.getTableData()
   }, [])
 
   return (
     <div className="company">
       <Table
         ref={tableRef}
         getTableData={getAllCompany}
         columns={tableColumns}
         onDelete={serviceDelCompany}
         onAdd={() => setState({
           showCreateCompanyModal: true,
           detail: {}
         })}
       />
 
       <CreateCompanyModal
         visible={state.showCreateCompanyModal}
         onSuccess={handleSuccess}
         onCancel={toggleCreateCompanyModal}
         detail={state.detail}
       />
     </div>
   )
 }
 
 export default CompanyPage
 