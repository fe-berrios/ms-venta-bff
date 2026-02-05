package bo.felipe.app.controller;

import bo.felipe.app.model.StatusResponse;
import bo.felipe.app.model.Venta;
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

    // C
    @PostMapping("/bff/add/venta")
    public VentaResponse addVenta(@RequestBody VentaRequest nuevaVenta){
        return ventaService.addVenta(nuevaVenta);
    }

    // R
    @GetMapping("/bff/venta/{buy_order}")
    public Venta getVentaByBO(@PathVariable("buy_order") String buy_order){
        return ventaService.getVentaByBO(buy_order);
    }

    // U
    @PutMapping("/bff/update/venta/{buy_order}")
    public Venta updateVenta(@PathVariable("buy_order")String buy_order, @RequestBody Venta venta){
        return ventaService.updateVenta(buy_order, venta);
    }

    // D
    @DeleteMapping("bff/delete/venta/{id}")
    public void deleteVenta(@PathVariable("id")Long id){
        ventaService.deleteVenta(id);
    }

    // Confirmar
    @PutMapping("/bff/status/venta/{token_ws}")
    public StatusResponse statusVenta(@PathVariable("token_ws")String token_ws){
        return ventaService.statusVenta(token_ws);
    }
}