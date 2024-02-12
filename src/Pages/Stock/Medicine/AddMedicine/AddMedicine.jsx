import { useEffect } from "react";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import style from "./AddMedicine.module.css";
import { useContext } from "react";
import { ShowContext } from "../../../../context/ShowContext";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Input from "../../../../components/input/Input";
import { FaPills } from "react-icons/fa";
import ButtonSubmit from "../../../../components/ButtonSubmit";
import { GiMedicinePills } from "react-icons/gi";
import Select from "../../../../components/Select/Select";
import { useFormik } from "formik";
import { PiFactoryFill } from "react-icons/pi";
import * as Yup from "yup";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import { BiReset } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { MedicineContext } from "../../../../context/MedicinesContext";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import IconV2 from "../../../../components/IconV2/IconV2";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
const AddMedicine = () => {
  const [modelSupplier, setModelSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const {
    medicineType,
    submitMedicine,
    updateMedicine,
    FetchMedicineInfos,
    loading: loading2,
    getMedicineType,
    error,
    setError,
    addNewMedicineType,
    setLoading: setLoading2,
  } = useContext(MedicineContext);
  const handleClose = () => {
    setModelSupplier(false);
  };
  const handleSuppliers = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      await addNewMedicineType(newSupplier);
      handleTypes();
      setNewSupplier("");
      setModelSupplier(false);
      toast.success("تم اضافة النوع بنجاح");
    } catch (error) {
      setError(error.message);
    }
    setLoading2(false);
  };

  const location = useLocation();
  const naviate = useNavigate();
  useDocumentTitle(
    location.pathname.includes("edit")
      ? "تعديل معلومات الدواء"
      : "اضافة دواء جديد"
  );
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const [name, setName] = useState("");
  const [loading3, setLoading3] = useState(false);
  const { id } = useParams();
  const formik = useFormik({
    initialValues: location.pathname.includes("edit")
      ? {
          type: "",
          company: "",
          code: "",
          quantity: "",
          days: "",
          en: "",
          ar: "",
          strength: "",
          activeingredient: "",
          mixType: "",
        }
      : {
          type: sessionStorage.getItem(`type-${location.pathname}`) || "",
          company: sessionStorage.getItem(`company-${location.pathname}`) || "",
          code: sessionStorage.getItem(`code-${location.pathname}`) || "",
          quantity:
            sessionStorage.getItem(`quantity-${location.pathname}`) || "",
          days: sessionStorage.getItem(`days-${location.pathname}`) || "",
          en: sessionStorage.getItem(`en-${location.pathname}`) || "",
          ar: sessionStorage.getItem(`ar-${location.pathname}`) || "",
          strength:
            sessionStorage.getItem(`strength-${location.pathname}`) || "",
          mixType: sessionStorage.getItem(`mixType-${location.pathname}`) || "",
          activeingredient:
            sessionStorage.getItem(`activeingredient-${location.pathname}`) ||
            "",
        },
    onSubmit: async (values) => {
      const category = medicineType.find((el) => el.name === values.type);
      values.type = {
        id: category.id,
        name: category.name,
      };
      setLoading2(true);
      let response;
      if (location.pathname.includes("edit")) {
        response = await updateMedicine(values);
      } else {
        response = await submitMedicine(values);
      }
      if (response.ok) {
        toast.success(
          location.pathname.includes("edit")
            ? "تم تعديل البيانات بنجاح"
            : "تم إضافة الدواء بنجاح"
        );
        formik.resetForm();
        sessionStorage.setItem(`type-${location.pathname}`, "");
        sessionStorage.setItem(`company-${location.pathname}`, "");
        sessionStorage.setItem(`code-${location.pathname}`, "");
        sessionStorage.setItem(`quantity-${location.pathname}`, "");
        sessionStorage.setItem(`strength-${location.pathname}`, "");
        sessionStorage.setItem(`days-${location.pathname}`, "");
        sessionStorage.setItem(`en-${location.pathname}`, "");
        sessionStorage.setItem(`ar-${location.pathname}`, "");
        sessionStorage.setItem(`activeingredient-${location.pathname}`, "");
        sessionStorage.setItem(`mixType-${location.pathname}`, "");
        formik.setValues({
          type: "",
          company: "",
          code: "",
          quantity: "",
          days: "",
          en: "",
          ar: "",
          strength: "",
          activeingredient: "",
          mixType: "",
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    validateOnMount: true,
    validationSchema: Yup.object().shape({
      type: Yup.string().required("الرجاء اختيار نوع الدواء"),
      company: Yup.string().required("الرجاء ادخال اسم المورد"),
      code: Yup.string().required("الرجاء ادخال كود الدواء"),
      quantity: Yup.number().required(
        "الرجاء ادخال الكمية المطلوب التنبيه قبلها"
      ),
      en: Yup.string().required("الرجاء ادخال اسم الدواء باللغة الانجليزية"),
      ar: Yup.string().required("الرجاء ادخال اسم الدواء باللغة العربية"),
      days: Yup.date().required(
        "الرجاء ادخال عدد الايام المطلوب التنبيه قبلها"
      ),
      mixType: Yup.string().when("type", {
        is: (value) => value === "منوعات",
        then: (schema) => schema.required("يجب اختيار نوع المنوعات"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
  });
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      const func = async () => {
        try {
          setLoading(true);
          const data = await FetchMedicineInfos(id);
          setInfo(data);
          setName(data.medicineCategory.name);
          formik.setValues({
            en: data.name,
            ar: data.arabicname,
            type: data.medicineCategory.name,
            company: data.manufacturer,
            code: data.barcode,
            quantity: data.alertamount,
            days: data.alertexpired,
            mixType: data.mixType,
            activeingredient: data.activeingredient,
            strength: data.strength,
          });
        } catch (error) {
          setError(error.message);
        }
        setLoading(false);
      };
      func();
    }
  }, [FetchMedicineInfos]);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const handleTypes = async () => {
    setLoading3(true);
    try {
      await getMedicineType();
    } catch (error) {
      setError(error.message);
    }
    const time = setTimeout(() => {
      setLoading3(false);
    }, 300);
    return () => {
      clearInterval(time);
    };
  };
  useEffect(() => {
    handleTypes();
  }, []);
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ margin: "auto" }}
      className={style.medicine + " d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack
        title={
          location.pathname.includes("edit")
            ? "تعديل معلومات الدواء"
            : "اضافة دواء جديد"
        }
        link=""
      />
      {loading || loading3 ? (
        <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
          جاري التحميل...
        </div>
      ) : !loading && !loading3 && !error ? (
        <Form onSubmit={formik.handleSubmit} className="pb-4">
          <Row lg="2" xs="1" md="2">
            <Col>
              <Input
                className="text-end"
                width={"100%"}
                label="اسم العنصر باللغة الانجليزية"
                type="text"
                id="en"
                placeholder={info.en}
                value={formik.values.en}
                error={formik.errors.en}
                touched={formik.touched.en}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="en"
                icon={<GiMedicinePills />}
              />
              <Input
                className="text-end mt-2"
                width={"100%"}
                label="المادة الفعالة"
                type="text"
                id="activeingredient"
                value={formik.values.activeingredient}
                error={formik.errors.activeingredient}
                touched={formik.touched.activeingredient}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="activeingredient"
                icon={<GiMedicinePills />}
              />
              <Row>
                <Col xs="10">
                  <Select
                    value={formik.values.type}
                    error={formik.errors.type}
                    touched={formik.touched.type}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    width={"100%"}
                    className="mt-2"
                    label="نوع العنصر"
                    type="text"
                    id="type"
                    name="type"
                    icon={<FaPills />}
                  >
                    <option value="">اختر نوع العنصر</option>
                    {medicineType.map((el) => {
                      return (
                        <option key={el.id} value={el.name}>
                          {el.name}
                        </option>
                      );
                    })}
                  </Select>
                </Col>
                <Col
                  id="addnewsuplier"
                  xs="2"
                  className="d-flex align-items-center"
                >
                  <Tooltip
                    anchorSelect="#addnewsuplier"
                    clickable={true}
                    place="left"
                    style={{ fontSize: "12px" }}
                  >
                    إضافة نوع جديد
                  </Tooltip>
                  <IconV2
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      marginRight: "-5px",
                      paddingLeft: "20px",
                    }}
                    id="selectType"
                    icon={<FaPills style={{ marginLeft: "-20px" }} />}
                    onClick={() => {
                      setModelSupplier(true);
                    }}
                  />
                </Col>
              </Row>
              <Input
                value={formik.values.company}
                error={formik.errors.company}
                touched={formik.touched.company}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 text-end"
                label="الشركة المصنعة"
                type="text"
                id="company"
                name="company"
                icon={<PiFactoryFill />}
              />
              <Input
                value={formik.values.code}
                error={formik.errors.code}
                touched={formik.touched.code}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2 text-end"
                label="كود العنصر"
                type="text"
                id="code"
                name="code"
                icon={"#"}
              />
              <Row>
                <Col sm="6">
                  <div className="d-flex flex-column">
                    <Input
                      value={formik.values.days}
                      error={formik.errors.days}
                      touched={formik.touched.days}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="text-end mt-2"
                      width={"100%"}
                      label="التنبيه قبل"
                      type="date"
                      id="days"
                      name="days"
                      icon={"يوم"}
                    />
                    <p className="descriptiveP">
                      *ارسال تنبيه قبل انتهاء الصلاحية بعدد معين من الايام
                    </p>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="d-flex flex-column">
                    <Input
                      value={formik.values.quantity}
                      error={formik.errors.quantity}
                      touched={formik.touched.quantity}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="text-end mt-2"
                      width={"100%"}
                      label="التنبيه قبل"
                      type="number"
                      id="quantity"
                      name="quantity"
                      icon={"كمية"}
                    />
                    <p className="descriptiveP">
                      *ارسال تنبيه عندما تصبح الكمية المتوفرة من الدواء عدد معين
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col className="d-flex flex-column justify-content-between">
              <div className="d-flex flex-column">
                <Input
                  value={formik.values.ar}
                  error={formik.errors.ar}
                  touched={formik.touched.ar}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="text-end mt-2 mt-md-0"
                  width={"100%"}
                  label="اسم العنصر باللغة العربية"
                  type="text"
                  id="ar"
                  name="ar"
                  icon={<GiMedicinePills />}
                />
              </div>
              <div className="d-flex flex-column">
                <Input
                  value={formik.values.strength}
                  error={formik.errors.strength}
                  touched={formik.touched.strength}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="text-end mt-2"
                  width={"100%"}
                  label="التركيز"
                  type="text"
                  id="strength"
                  name="strength"
                  icon={"ملج"}
                />
              </div>
              {/* <Select
                value={
                  formik.values.type === "منوعات"
                    ? formik.values.mixType
                    : "لا يوجد"
                }
                error={formik.errors.mixType}
                touched={formik.touched.mixType}
                disabled={formik.values.type !== "منوعات"}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                width={"100%"}
                className="mt-2"
                label="نوع المنوعات"
                id="mixType"
                name="mixType"
                icon={<FaPills />}
              >
                <option value="">اختر نوع المنوعات</option>
                <option value="1">شراب</option>
                <option value="2">حقن</option>
                <option value="3">مراهم</option>
                <option value="4">محاليل</option>
                <option value="5">مسكنات</option>
                <option value="6">مضادات حيوية</option>
                {formik.values.type !== "منوعات" && (
                  <option value="لا يوجد">لا يوجد</option>
                )}
              </Select> */}
              <div
                className={`${style.buttonandsvg} mt-2`}
                style={{ margin: "auto", width: "100%" }}
              >
                <div className="inner m-auto" style={{ width: "100%" }}>
                  <div className="svg text-center">
                    <div className={style.img}>
                      <img src="/newMedi.svg" alt="" />
                    </div>
                  </div>

                  <div className="btnnn text-center w-100 mt-2 d-flex flex-row justify-content-center align-items-center gap-2">
                    <ButtonSubmit
                      disabled={!formik.isValid || loading2}
                      className={`btn-main ${
                        location.search.includes("return")
                          ? "w-100"
                          : "w-50 m-auto my-1"
                      }`}
                    >
                      {loading2
                        ? "جاري الاضافة ..."
                        : location.pathname.includes("edit")
                        ? "حفظ التعديلات"
                        : "اضافة دواء"}
                    </ButtonSubmit>
                    {location.search.includes("return") && (
                      <Button
                        onClick={() => naviate(-1, { replace: true })}
                        className="btn-main w-100 fontSize12px"
                      >
                        الرجوع الى العملية السابقة
                      </Button>
                    )}
                    <Button
                      id="not-clickable"
                      className={`btn-main w-25 ${
                        location.search.includes("return")
                          ? "w-25"
                          : "w-50 m-auto my-1"
                      }`}
                      onClick={() => {
                        sessionStorage.setItem(`type-${location.pathname}`, "");
                        sessionStorage.setItem(
                          `company-${location.pathname}`,
                          ""
                        );
                        sessionStorage.setItem(`code-${location.pathname}`, "");
                        sessionStorage.setItem(
                          `quantity-${location.pathname}`,
                          ""
                        );
                        sessionStorage.setItem(`days-${location.pathname}`, "");
                        sessionStorage.setItem(`en-${location.pathname}`, "");
                        sessionStorage.setItem(`ar-${location.pathname}`, "");
                        sessionStorage.setItem(
                          `strength-${location.pathname}`,
                          ""
                        );
                        sessionStorage.setItem(
                          `activeingredient-${location.pathname}`,
                          ""
                        );
                        sessionStorage.setItem(
                          `mixType-${location.pathname}`,
                          ""
                        );
                        formik.resetForm();
                        formik.setValues({
                          type: "",
                          company: "",
                          code: "",
                          quantity: "",
                          days: "",
                          en: "",
                          ar: "",
                          strength: "",
                          activeingredient: "",
                          mixType: "",
                        });
                      }}
                    >
                      <BiReset />
                      <Tooltip
                        anchorSelect="#not-clickable"
                        clickable={true}
                        style={{ fontSize: "12px" }}
                      >
                        اعادة تعيين البيانات
                      </Tooltip>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      ) : error ? (
        <p className="text-center p-0 m-0 mt-5 fw-bold">
          عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
        </p>
      ) : null}
      {createPortal(
        <Modal show={modelSupplier} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>إضافة نوع جديد</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSuppliers}>
              <Row className="flex-wrap">
                <Col>
                  <Input
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="اسم النوع"
                    type="text"
                    id="newSupplier"
                    name="newSupplier"
                    icon={<FaPills />}
                  />
                </Col>
              </Row>

              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit
                  disabled={!newSupplier.trim() || loading2}
                  className="btn-main"
                  variant="primary"
                >
                  {loading2 ? "جاري التحميل..." : "إضافة النوع"}
                </ButtonSubmit>
                <Button className="btn-main" onClick={handleClose}>
                  إغلاق
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>,
        document.getElementById("modal")
      )}
    </motion.div>
  );
};

export default AddMedicine;
