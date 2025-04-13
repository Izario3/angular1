const express=require('express');
const router=express.Router();
const db=require('../db');

//obtener los productos
router.get('/',(req,res)=>{
db.query('SELECT * FROM productos;',(err,datos)=>{
if(err) return res.status(500).send(err);
res.json(datos);
});
});

module.exports=router;