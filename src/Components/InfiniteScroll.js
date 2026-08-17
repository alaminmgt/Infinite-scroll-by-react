/* eslint-disable react-hooks/exhaustive-deps */
import React,{useEffect,useState,useRef, useCallback} from 'react'
import { ClipLoader } from "react-spinners";


const InfiniteScroll = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(2);

    const loaderRef = useRef();
    

    const getData = async(page)=>{
        setLoading(true);
        setError(false);
        try {
            const url =await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`);
            if (!url.ok) {
               throw new Error("Failed to load data") 
            }
            const resData = await url.json();
            return resData;
            // console.log(resData);
        } catch (error) {
            setError(true);
            setData([]);
            return null;
        } 
    }
    const firstPage = async() =>{
        const datas = await getData(1);
        setData(datas);
        console.log(datas);   
    }

    const loadMore = useCallback(async() => {
        if (loading) return;
        const datas = await getData(page);
        if (datas) {
                setData((prevData)=>[...prevData,...datas]);
                setPage((prePage)=>prePage+1);
        } 
    },[page,loading])

    useEffect(() => {
      const observer = new IntersectionObserver((entries)=>{
        const entry = entries[0];
        console.log(entry);
        if (entry.isIntersecting) {
            loadMore();
        }
        
      })
        if (loaderRef.current) {
           observer.observe(loaderRef.current) 
        }
        return (()=>{
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current)
            }
        })
    }, [])
    
    useEffect(() => {
      firstPage();
    }, [])
    
  return (
    <div className='container'>
      <h1>Infinite scroll</h1>
      {error && <p>Something went wrong...</p>}
      {
        data ? data.map((curVal,index)=>{
            return (
                <div key={index} className='images'>
                    <img src={curVal.download_url} alt="" />
                </div>
            )
        })
        :""
      }
      <div style={{textAlign:"center"}} ref={loaderRef}>{loading ? 
        <ClipLoader
            color="white"
            loading={loading}
            cssOverride={{margin:"33"}}
            size="48px"
            aria-label="Loading Spinner"
            data-testid="loader"
        />
        : ""}</div>
    </div>
  )
}

export default InfiniteScroll
