import React from 'react';
import style from '../../styles/Servicos.module.css';
import Axios from 'axios';
import Head from 'next/head';
import Router from 'next/router';
import Menu from '../components/menu'
import Card from 'react-bootstrap/Card'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Formik, Field, Form } from 'formik';


class Feed extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            nome: '',
            servicos: [],
            pagina_atual: 1,
            total_paginas: '',
            descricao: ''
        }
    }

    componentDidMount(){
        this.setState({
            nome: localStorage.getItem('nome')
        })
        this.getServicos()
    }

    getServicos = () =>{
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
        let pagina_atual = this.state.pagina_atual
        Axios.get('./api/job/get_jobs?page='+pagina_atual+'&limit=5&user=false', config)
        .then(res =>{
            this.setState({
                servicos: res.data.jobs,
                total_paginas: res.data.maxPage,
                pagina_atual: res.data.curPage
            })
        })
        .catch(err =>{
            alert(err)
        })
    }

    handleChange = e =>{
        this.setState({
            descricao: e.target.value
        })
    }

    renderServicosAtivos = () =>{
        return this.state.servicos.map((servico) => {
            return <div className='col-8 mt-2'>
                <Card>
                    <Card.Body>
                        <div className='row'>
                            <div className='col-9'>
                                <h5>{servico.title} - {servico.category}</h5>
                            </div>
                            <div className='col-3'>
                                Ativo/Desativo
                            </div>
                        </div>
                        <p>{servico.description}</p>
                    </Card.Body>
                </Card>
            </div>
        })
    }

    criarServico = e =>{
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
        const data = {
            title: e.titulo,
            description: this.state.descricao,
            category: e.categoria,
        }
        console.log(data)
        Axios.post('./api/job/create_job', data, config)
        .then(res =>{
            alert("Solicitação enviada com sucesso!")
            location.reload()
        })
        .catch(err =>{
            alert(err)
        })
    }

    alterarDados(){
        Router.push('./alterar_dados')
    }

    render(){
        return(
            <div className={style.servicos}>
                <Head>
                    <title>Jobify</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Menu/>
                <div className="row mt-4 justify-content-center">
                    <div className='col-8'> 
                    <Tabs defaultActiveKey="ativos" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="ativos" title="Meus Serviços">
                        <div className="row mt-4 justify-content-center">
                            {this.renderServicosAtivos()}
                        </div>
                        </Tab>
                        <Tab eventKey="contratados" title="Contratados">
                            Profile
                        </Tab>
                        <Tab eventKey="solicitacoes" title="Solicitações">
                            Contact
                        </Tab>
                    </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default Feed;