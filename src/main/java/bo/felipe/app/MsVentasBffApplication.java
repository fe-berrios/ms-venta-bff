package bo.felipe.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsVentasBffApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsVentasBffApplication.class, args);
	}

}
