import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import ApexCharts from 'react-apexcharts';
import download from "downloadjs";

function TestResult(props){
  let path = props.path;
  const [loading, setLoading] = useState(false);
  const [average, setAverage] = useState("");
  const [max, setMax] = useState("");
  const [min, setMin] = useState("");
  const [isTestResult, setIsTestResult] = useState(false);
  const [series, setSeries] = useState([]);
  const options ={
    chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
    colors: ['#2e5fff', '#ff537e', '#595b6e'],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          ["평균값", average+"점"],
          ["최댓값", max+"점"],
          ["최솟값", min+"점"]
        ],
        labels: {
          style: {
            // colors: colors,
            fontSize: '17px',
            fontWeight: 'bold'
          }
        }
      }
  };
  
  useEffect(()=>{
    console.log(props);
    getTestResult();
  },[]);

  async function getTestResult(){
    let response = await fetch(baseUrl+path+'/result',{
        method: 'GET',
        credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        if(res.errorMessage != undefined){ //error
            alert(res.errorMessage);
          }
        else{ //success
          setIsTestResult(true);
          setAverage(res.average);
          setMax(res.max);
          setMin(res.min);
          let data = [{
            data: [res.average, res.max, res.min]
          }];
          setSeries(data);
        }
        setLoading(true);
      })
      .catch(error => {console.error('Error:', error)});
  }

  async function downloadTestResultExcel(){
    fetch(baseUrl+path+"/result/excel",{
      method: 'GET',
      credentials : 'include',
    })
    .then(res => res.json())
    .then(res =>{
      if(res.errorMessage != undefined){ //error
        alert(res.errorMessage);
      }
      else{
        fetch(baseUrl+path+"/result/excel",{
          method: 'GET',
          credentials : 'include',
        })
        .then(res => res.blob())
        .then(blob => download(blob, 'test_result.xlsx'))
        .catch(error => {console.error('Error:', error)});
      }
    })
  }

  return(
    <div style={{marginLeft:"7%", marginTop:"1%", width:"70%"}}>
    {loading? 
    <>
      {isTestResult?
        <div>
          <Button style={{float:"right", marginRight:"15%", backgroundColor:"#3d4657", borderColor:"#3d4657"}} onClick={()=>downloadTestResultExcel()}>시험 결과 Excel 다운로드</Button>
          <p style={{marginTop:"3%", fontSize:"29px", marginLeft:"25%"}}>시험 결과</p>
          <div style={{marginTop:"5%", marginLeft:"2%"}}>
            <ApexCharts options={options} series={series} width={900} type="bar" height={350} />
          </div>
        </div>:
        <h2 style={{textAlign:"center", marginTop:"15%"}}>시험 결과를 찾을 수 없습니다.</h2>}
    </>:
    <div>
      <h2 style={{marginRight:"15%", marginTop:"10%"}}>정보를 불러오는 중입니다.</h2>
      <Spinner animation="border" role="status" style={{marginRight:"15%", marginTop:"2%", width:"50px", height:"50px"}}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>}
    </div>
  )
}

export default TestResult;