package bo.felipe.app.controller;

import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import bo.felipe.app.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class VentaController {

    @Autowired
    VentaService ventaService;

    @PostMapping("/bff/add/venta")
    public VentaResponse addVenta(@RequestBody VentaRequest nuevaVenta){
        return ventaService.addVenta(nuevaVenta);
    }

}