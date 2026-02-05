package bo.felipe.app.client;

import bo.felipe.app.model.StatusResponse;
import bo.felipe.app.model.Venta;
import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "svc-business", url = "http://localhost:8081")
public interface IBusinessC {

    // C
    @PostMapping("/bs/add/venta")
    VentaResponse addVenta(@RequestBody VentaRequest nuevaVenta);

    // R
    @GetMapping("/bs/venta/{buy_order}")
    Venta getVentaByBO(@PathVariable("buy_order")String buy_order);

    // U
    @PutMapping("/bs/update/venta/{buy_order}")
    Venta updateVenta(@PathVariable("buy_order")String buy_order, Venta venta);

    // D
    @DeleteMapping("/bs/delete/venta/{id}")
    void deleteVenta(@PathVariable("id")Long id);

    // Confirmar
    @PutMapping("/bs/confirm/venta/{token_ws}")
    StatusResponse statusVenta(@PathVariable("token_ws")String token_ws);

}
