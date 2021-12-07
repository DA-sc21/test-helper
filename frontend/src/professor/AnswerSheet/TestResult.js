import React, { useEffect, useState } from 'react'
import { } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import ApexCharts from 'react-apexcharts';

function TestResult(props){
  let path = props.path;
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState();
  const [isTestResult, setIsTestResult] = useState(false);
  const [series, setSeries] = useState([]);
//   const series = [{
//     data: [70, 90, 15]
//   }] 
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
          columnWidth: '45%',
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
          ["평균값", ],
          ["최댓값", ],
          ["최솟값", ]
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
          setTestResult(res);
          let data = [{
            data: [res.average, res.max, res.min]
          }];
          setSeries(data);
        }
        setLoading(true);
      })
      .catch(error => {console.error('Error:', error)});
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{width:"80%"}}>
      {isTestResult?
        <div>
          <p style={{marginTop:"2%", fontSize:"27px"}}>시험 결과</p>
          <div style={{marginTop:"3%", marginLeft:"13%"}}>
            <ApexCharts options={options} series={series} width={900} type="bar" height={350} />
          </div>
        </div>:
        <h2 style={{textAlign:"center", marginTop:"15%"}}>시험 결과를 찾을 수 없습니다.</h2>}
    </div>
  )
}

export default TestResult;