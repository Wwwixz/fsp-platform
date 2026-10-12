package fsp.platform.meta;

import fsp.platform.competition.Discipline;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Публичные справочники для селектов фронтенда.
 */
@RestController
@RequestMapping("/api/meta")
public class MetaController {

  @GetMapping("/disciplines")
  public List<String> disciplines() {
    return Arrays.stream(Discipline.values()).map(Discipline::label).toList();
  }

  @GetMapping("/regions")
  public List<String> regions() {
    return List.of(
        "Москва", "Санкт-Петербург", "Новосибирская область", "Свердловская область",
        "Татарстан", "Красноярский край", "Пермский край", "Самарская область",
        "Ростовская область", "Башкортостан", "Челябинская область", "Омская область",
        "Томская область", "Мурманская область", "Архангельская область",
        "Воронежская область", "Нижегородская область", "Волгоградская область",
        "Приморский край", "Калининградская область");
  }

  /** Карта соответствия ролей фронтенда и бекенда — для отладки и документации. */
  @GetMapping("/roles")
  public Map<String, String> roles() {
    return Map.of(
        "athlete", "Спортсмен",
        "organizer", "Региональный представитель",
        "FEDERATION", "Всероссийская Федерация спортивного программирования");
  }
}
