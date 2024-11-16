import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Categories from "../../api/Categories.json";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Toggler from "../../components/common/Toggler.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const ManageCategories = () => {
  const categories = Categories;
  const navigate = useNavigate();
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  const [fields, setCategories] = useState({
    name: "",
    description: "",
    parentCategoryValue: "",
    status: "",
    isFeatured: false
  });

  const handleInputChange = (key, value) => {
    setCategories({
      ...fields,
      [key]: value,
    });
  };

  const statusOptions = [
    { "value": "active", "label": "ativo" },
    { "value": "completed", "label": "concluído" },
    { "value": "new", "label": "novo" },
    { "value": "coming soon", "label": "em breve" },
    { "value": "inactive", "label": "inativo" },
    { "value": "out of stock", "label": "sem estoque" },
    { "value": "discontinued", "label": "descontinuado" },
    { "value": "on sale", "label": "em promoção" },
    { "value": "featured", "label": "destaque" },
    { "value": "pending", "label": "pendente" },
    { "value": "archive", "label": "arquivado" },
    { "value": "pause", "label": "pausado" }
  ]

  const parentCategories = Categories.map(category => ({
    value: category.name,
    label: category.name
  }))

  const selectParentCategory = (selectedOption) => {
    setCategories({
      ...fields,
      parentCategoryValue: selectedOption.label,
    });
  };

  const selectSelect = (selectedOption) => {
    setCategories({
      ...fields,
      status: selectedOption.label,
    });
  };

  const bulkAction = [
    { value: "delete", label: "Apagar" },
    { value: "category", label: "Categoria" },
    { value: "status", label: "Estado" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      fields.forEach((category) => {
        updateChecks[category.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckCategory = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const handleFeaturedChange = (ischeck) => {
    setCategories({
      ...fields,
      isFeatured: ischeck,
    });
  };

  const actionItems = ["Apagar", "Editar"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase()
    if (updateItem === "apagar") {
      alert(`#${itemID} item apagado`)
    }
    else if (updateItem === "editar") {
      navigate(`/catalog/categories/manage/${itemID}`)
    }
  };

  return (
    <section className="categories">
      <div className="container">
        <div className="wrapper">
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Adicionar Categoria</h2>
              <div className="column">
                <Thumbnail />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Insira o nome da categoria"
                  label="Nome"
                  value={fields.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <div className="column">
                <Textarea
                  type="text"
                  placeholder="Descrição"
                  label="Descrição"
                  value={fields.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>
              <Divider />
              <div className="column">
                <MultiSelect
                  label="Categoria Pai"
                  placeholder="Selecione a Categoria Pai"
                  onClick={selectParentCategory}
                  isMulti={false}
                  options={parentCategories}
                  isSelected={fields.parentCategoryValue}
                />
              </div>
              <div className="column">
                <Dropdown
                  label="Estado"
                  placeholder="Selecione o Estado"
                  onClick={selectSelect}
                  options={statusOptions}
                  selectedValue={fields.status}
                />
              </div>
              <div className="column">
                <Toggler
                  label="Está em destaque?"
                  checked={fields.isFeatured}
                  onChange={handleFeaturedChange}
                />
              </div>
              <Divider />
              <Button
                label="Descartar"
                className="right outline"
              />
              <Button
                label="Salvar"
              />
            </div>
          </div>
          <div className="content transparent">
            <div className="content_head">
              <Dropdown
                placeholder="Ação em Lote"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder="Pesquisar Categorias..."
                className="sm table_search"
              />
              <div className="btn_parent">
                <Link to="/catalog/category/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Criar Categoria</span>
                </Link>
              </div>
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      <th className="td_id">ID</th>
                      <th className="td_image">Imagem</th>
                      <th>Nome</th>
                      <th className="td_order">Ordem</th>
                      <th className="td_status">Estado</th>
                      <th>Criado em</th>
                      <th className="td_action">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, key) => {
                      return (
                        <tr key={key}>
                          <td className="td_checkbox">
                            <CheckBox
                              onChange={(isCheck) =>
                                handleCheckCategory(isCheck, category.id)
                              }
                              isChecked={specificChecks[category.id] || false}
                            />
                          </td>
                          <td className="td_id">{category.id}</td>
                          <td className="td_image">
                            <img src={category.image} alt={category.name} />
                          </td>
                          <td>
                            <Link to={category.id}>{category.name}</Link>
                          </td>
                          <td className="td_order">{category.order}</td>
                          <td className="td_status">
                            {category.status.toLowerCase() === "ativo" ||
                              category.status.toLowerCase() === "concluído" ||
                              category.status.toLowerCase() === "novo" ||
                              category.status.toLowerCase() === "em breve" ? (
                              <Badge
                                label={category.status}
                                className="light-success"
                              />
                            ) : category.status.toLowerCase() === "inativo" ||
                              category.status.toLowerCase() === "sem estoque" ||
                              category.status.toLowerCase() === "descontinuado" ? (
                              <Badge
                                label={category.status}
                                className="light-danger"
                              />
                            ) : category.status.toLowerCase() === "em promoção" ||
                              category.status.toLowerCase() === "destaque" ||
                              category.status.toLowerCase() === "pendente" ? (
                              <Badge
                                label={category.status}
                                className="light-info"
                              />
                            ) : (
                              <Badge
                                label={category.status}
                                className="light"
                              />
                            )}
                          </td>
                          <td>{category.created_at}</td>
                          <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              itemID={category.id}
                              handleActionItemClick={handleActionItemClick}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pagination_wrapper">
                <Dropdown
                  options={tableRow}
                  placeholder="Mostrar 5 Linhas"
                  isMulti={false}
                  selectedValue={selectedValue}
                  onClick={showTableRow}
                  className="sm"
                />
                <Pagination
                  currentPage={currentPage}
                  pageCount={3}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;
