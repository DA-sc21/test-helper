import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import "./Course.css"

const CourseFooter= (props) => {
    const [itemsCount, setItemsCount] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [onPageChange, setOnPageChange] = useState(1);
    const [activePage, setActivePage] = useState(1);

    function handlePageChange(pageNumber) {
        setActivePage(pageNumber);
    }

    useEffect(()=>{
        if(!sessionStorage.getItem("isAdmin")){
            alert("관리자 로그인 후 사용 가능합니다.");
            document.location.href="/admin";
        }
        // setItemsCount(props.itemsCount);
        // setPageSize(props.pageSize);
        // setCurrentPage(props.currentPage);
        // setOnPageChange(props.onPageChange);
        setActivePage(1);
      },[])

    const pageCount = Math.ceil(props.itemsCount/pageSize);
        if(pageCount === 1) return null;
        let pages;
        if(pageCount > 5 && currentPage>5){
            if(pageCount<=currentPage+3){
                pages=_.range(currentPage-(currentPage+4-pageCount),pageCount+1);
            }
            else{
                pages=_.range(currentPage-2,currentPage+3);
            }
        }
        else if(pageCount > 5 && currentPage<=5){
            pages=_.range(1,6);
        }
        else{
            pages=_.range(1,pageCount+1);
        }
        return (
            <div>
            <nav>
                <table className={"pageCount"}>
                    <tbody>
                <tr className={"pageCount"}>
                    <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(1); handlePageChange(1);}}>First</button></td>
                    {currentPage>1 ?
                        <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(currentPage-1); handlePageChange(currentPage-1);}}>Prev</button></td>
                    : <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(currentPage); handlePageChange(currentPage);}}>Prev</button></td>}
                    {pages.map(page => (
                        <td
                            key={page}
                            className={page === activePage ? "page-item active" : "page-item"}>
                            <button className={"page-link"}onClick={() => {props.onPageChange(page); handlePageChange(page);}}>{page}</button>
                        </td>
                    ))}
                    {currentPage<pageCount ?
                        <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(currentPage+1); handlePageChange(currentPage+1);}}>Next</button></td>
                        : <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(currentPage); handlePageChange(currentPage);}}>Next</button></td>}
                    <td className={"page-item"} ><button className={"page-link"} onClick={() => {props.onPageChange(pageCount); handlePageChange(pageCount);}}>Last</button></td>
                </tr>
                    </tbody>
                </table>
            </nav>
            </div>
        );

 

}


export default CourseFooter;