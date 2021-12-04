import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import "./Course.css"

const CourseFooter= (props) => {
    const [itemsCount, setItemsCount] = useState(props.itemsCount);
    const [pageSize, setPageSize] = useState(props.pageSize);
    const [currentPage, setCurrentPage] = useState(props.currentPage);
    const [onPageChange, setOnPageChange] = useState(props.onPageChange);
    const [activePage, setActivePage] = useState(1);

    function handlePageChange(pageNumber) {
        setActivePage(pageNumber);
    }

    const pageCount = Math.ceil(itemsCount/pageSize);
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