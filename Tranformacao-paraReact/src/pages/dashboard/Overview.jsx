import React from 'react';
import {Link} from 'react-router-dom';
import * as Icons from "react-icons/tb";
import Bar from '../../charts/Bar.jsx';
import Area from '../../charts/Area.jsx';
import Products from '../../api/Products.json';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Profile from '../../components/common/Profile.jsx';

const Overview = () => {
	return (
		<section>
			<div className="container">
				<div className="wrapper">
					<div className="content">
						<div className="content_item sale_overview">
				      <div className="sale_overview_card">
				        <Icons.TbShoppingCart />
				        <div className="sale_overview_content">
				          <h5 className="sale_title">Total de Vendas</h5>
				          <h4 className="sale_value">100.210 MZN</h4>
				        </div>
				      </div>
				      <div className="sale_overview_card">
				        <Icons.TbShoppingBag />
				        <div className="sale_overview_content">
				          <h5 className="sale_title">Total de Pedidos</h5>
				          <h4 className="sale_value">46</h4>
				        </div>
				      </div>
				      <div className="sale_overview_card">
				        <Icons.TbPackage />
				        <div className="sale_overview_content">
				          <h5 className="sale_title">Total de Itens</h5>
				          <h4 className="sale_value">5678</h4>
				        </div>
				      </div>
				      <div className="sale_overview_card">
				        <Icons.TbChartBar />
				        <div className="sale_overview_content">
				          <h5 className="sale_title">Receita Total</h5>
				          <h4 className="sale_value">987.654 MZN</h4>
				        </div>
				      </div>
				    </div>
				    <div className="content_item">
				    	<h2 className="sub_heading">
				    		<span>Análise de Vendas</span>
				    		<Button
				    			label="Venda Total"
				    			className="sm"
				    		/>
				    	</h2>
				    	<Area/>
				    </div>
				    <div className="content_item">
				    	<h2 className="sub_heading">Produtos Mais Vendidos</h2>
				    	<table className="simple">
							  <thead>
							    <tr>
							      <th>Nome</th>
							      <th>Categoria</th>
							      <th>Preço</th>
							      <th>Estado</th>
							      <th>Quantidade</th>
							    </tr>
							  </thead>
							  <tbody>
							    {Products.map((product, key) => (
							      <tr key={key}>
							      	<td>
							      		<Profile 
							      			src={product.images.thumbnail}
							      			slogan={product.category}
							      			name={product.name}
							      		/>
							      	</td>
							        <td>{product.category}</td>
							        <td>{product.price}MZN</td>
							        <td>
							        	{product.inventory.in_stock ? (
                          <Badge
                            label="Em Estoque"
                            className="light-success"
                          />
                        ) : product.inventory.quantity < 10 &&
                          product.inventory.quantity > 0 ? (
                          <Badge
                            label="Estoque Baixo"
                            className="light-warning"
                          />
                        ) : (
                          <Badge
                            label="Fora de Estoque"
                            className="light-danger"
                          />
                        )}
							        </td>
							        <td>{product.inventory.quantity}</td>
							      </tr>
							    ))}
							  </tbody>
							</table>
				    </div>
					</div>
					<div className="sidebar">
						<div className="sidebar_item">
							<h2 className="sub_heading">Público</h2>
							<Bar/>
						</div>
						<div className="sidebar_item">
							<h2 className="sub_heading">Pedidos Recentes</h2>
							<div className="recent_orders column">
								{
									Products.map((product, key)=>( 
										<Link key={key} to={`/orders/manage/${product.id}`} className="recent_order">
											<figure className="recent_order_img">
												<img src={product.images.thumbnail} alt=""/>
											</figure>
											<div className="recent_order_content">
												<h4 className="recent_order_title">{product.name}</h4>
												<p className="recent_order_category">{product.category}</p>
											</div>
											<div className="recent_order_details">
												<h5 className="recent_order_price">{product.price}MZN</h5>
												<p className="recent_order_quantity">Itens: {product.inventory.quantity}</p>
											</div>
										</Link>
									))
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Overview;
