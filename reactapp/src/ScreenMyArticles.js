import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const findArticles = async() => {
      const data = await fetch(`/get-articles?tokenFromFront=${props.tokenToDisplay}`);
      const body = await data.json();
      setArticles(body); 
    }
    findArticles()    
  },[]);

  let deleteArticle = async (article)=>{
    let delet = await fetch(`/delete-article/${article._id}/${props.tokenToDisplay}`,{
      method: 'DELETE'
    });
    let body = await delet.json();
    console.log(body);
    setArticles(body);
  }



  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)
  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var noArticles
  if(articles == 0){
    noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  }

  let articlesLang = articles;
  if(props.langueToDisplay=='fr'){
    articlesLang = [...articles].filter((e)=>(e.lang=='fr'));
  }else if(props.langueToDisplay=='en'){
    articlesLang = [...articles].filter((e)=>(e.lang=='en'));
  }


  return (
    <div>
            <Nav/>
            <div className="Banner"/>
            {noArticles}
            <div className="Card">
            {articlesLang.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>
                  <Card
                    style={{ 
                    width: 300, 
                    margin:'15px', 
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.image}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => deleteArticle(article)} />
                    ]}
                    >
                    <Meta
                      title={article.title}
                      description={article.description}
                    />
                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>
                </div>
              ))}
             </div>
      </div>
  );
}

function mapStateToProps(state){
  return {langueToDisplay : state.selectedLang, tokenToDisplay: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
