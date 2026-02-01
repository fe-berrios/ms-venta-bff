package bo.felipe.app.controller;

import bo.felipe.app.model.StatusResponse;
import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import bo.felipe.app.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class VentaController {

    @Autowired
    VentaService ventaService;

    @PostMapping("/bff/add/venta")
    public VentaResponse addVenta(@RequestBody VentaRequest nuevaVenta){
        return ventaService.addVenta(nuevaVenta);
    }

    @PutMapping("/bff/status/venta/{token_ws}")
    public StatusResponse statusVenta(@PathVariable("token_ws")String token_ws){
        return ventaService.statusVenta(token_ws);
    }

}