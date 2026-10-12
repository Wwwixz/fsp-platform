package fsp.platform.seed;

import fsp.platform.application.ApplicationEntity;
import fsp.platform.application.ApplicationRepository;
import fsp.platform.application.ApplicationStatus;
import fsp.platform.competition.CompetitionEntity;
import fsp.platform.competition.CompetitionRepository;
import fsp.platform.competition.CompetitionStatus;
import fsp.platform.competition.CompetitionType;
import fsp.platform.competition.Discipline;
import fsp.platform.competition.ScheduleItemEntity;
import fsp.platform.result.ResultEntity;
import fsp.platform.result.ResultRepository;
import fsp.platform.team.TeamEntity;
import fsp.platform.team.TeamRepository;
import fsp.platform.team.TeamStatus;
import fsp.platform.user.Role;
import fsp.platform.user.UserEntity;
import fsp.platform.user.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Синтетические данные для демонстрации (ТЗ допускает синтетику на демо).
 * Заполняет пустую базу: демо-аккаунты, соревнования, команды, заявки и итоги.
 * Идемпотентен: если в базе уже есть пользователи, сидинг не выполняется.
 */
@Component
public class DataSeeder implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
  private static final String DEMO_PASSWORD = "password123";

  private final UserRepository users;
  private final CompetitionRepository competitions;
  private final TeamRepository teams;
  private final ApplicationRepository applications;
  private final ResultRepository results;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public DataSeeder(UserRepository users, CompetitionRepository competitions,
                    TeamRepository teams, ApplicationRepository applications,
                    ResultRepository results) {
    this.users = users;
    this.competitions = competitions;
    this.teams = teams;
    this.applications = applications;
    this.results = results;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (users.count() > 0) {
      return;
    }
    log.info("База пуста — заполняю синтетическими данными");
    seed();
    log.info("Сидинг завершён: {} пользователей, {} соревнований, {} команд, {} заявок",
        users.count(), competitions.count(), teams.count(), applications.count());
  }

  private void seed() {
    String hash = encoder.encode(DEMO_PASSWORD);
    int year = LocalDate.now().getYear();

    /* ---------- Пользователи ---------- */
    UserEntity federation = user("Федерация ФСП", "federation@fsp.ru", Role.FEDERATION, "Москва", 0, hash);

    UserEntity regNsk = user("Анна Сидорова", "novosibirsk@fsp.ru", Role.REGIONAL, "Новосибирская область", 0, hash);
    UserEntity regMsk = user("Павел Козлов", "moscow@fsp.ru", Role.REGIONAL, "Москва", 0, hash);
    UserEntity regSpb = user("Игорь Васильев", "spb@fsp.ru", Role.REGIONAL, "Санкт-Петербург", 0, hash);
    UserEntity regEkb = user("Марина Орлова", "ekb@fsp.ru", Role.REGIONAL, "Свердловская область", 0, hash);

    // Демо-спортсмен (аккаунт по умолчанию на странице входа).
    UserEntity ivan = user("Иван Петров", "athlete@fsp.ru", Role.ATHLETE, "Москва", 0, hash);
    UserEntity alexey = user("Алексей Иванов", "alexey@fsp.ru", Role.ATHLETE, "Новосибирская область", 0, hash);
    UserEntity maria = user("Мария Соколова", "maria@fsp.ru", Role.ATHLETE, "Москва", 0, hash);
    UserEntity dmitry = user("Дмитрий Петров", "dmitry@fsp.ru", Role.ATHLETE, "Красноярский край", 0, hash);
    UserEntity ekaterina = user("Екатерина Орлова", "ekaterina@fsp.ru", Role.ATHLETE, "Татарстан", 0, hash);
    UserEntity ivanF = user("Иван Фёдоров", "ivanf@fsp.ru", Role.ATHLETE, "Воронежская область", 0, hash);
    UserEntity anna = user("Анна Кузнецова", "anna@fsp.ru", Role.ATHLETE, "Мурманская область", 0, hash);
    UserEntity sergey = user("Сергей Морозов", "sergey@fsp.ru", Role.ATHLETE, "Пермский край", 0, hash);
    UserEntity olga = user("Ольга Белова", "olga@fsp.ru", Role.ATHLETE, "Башкортостан", 0, hash);
    UserEntity pavel = user("Павел Громов", "pavel@fsp.ru", Role.ATHLETE, "Челябинская область", 0, hash);
    UserEntity irina = user("Ирина Степанова", "irina@fsp.ru", Role.ATHLETE, "Архангельская область", 0, hash);
    UserEntity nikolay = user("Николай Зайцев", "nikolay@fsp.ru", Role.ATHLETE, "Нижегородская область", 0, hash);
    UserEntity ksenia = user("Ксения Романова", "ksenia@fsp.ru", Role.ATHLETE, "Санкт-Петербург", 0, hash);
    UserEntity artem = user("Артём Волков", "artem@fsp.ru", Role.ATHLETE, "Свердловская область", 0, hash);
    UserEntity gleb = user("Глеб Никитин", "gleb@fsp.ru", Role.ATHLETE, "Томская область", 0, hash);
    UserEntity dasha = user("Дарья Лебедева", "dasha@fsp.ru", Role.ATHLETE, "Татарстан", 0, hash);
    UserEntity maksim = user("Максим Крылов", "maksim@fsp.ru", Role.ATHLETE, "Санкт-Петербург", 0, hash);
    UserEntity evgeny = user("Евгений Захаров", "evgeny@fsp.ru", Role.ATHLETE, "Новосибирская область", 0, hash);
    UserEntity timur = user("Тимур Ахметов", "timur@fsp.ru", Role.ATHLETE, "Татарстан", 0, hash);
    UserEntity sofiya = user("Софья Морозова", "sofiya@fsp.ru", Role.ATHLETE, "Москва", 0, hash);

    /* ---------- Соревнования ----------
     * Даты задаются относительно «сегодня», чтобы демо всегда имело
     * активные соревнования с открытой регистрацией и завершённые с итогами. */
    LocalDate today = LocalDate.now();
    CompetitionEntity cubokSibiri = competition(
        "Кубок Сибири по алгоритмическому программированию", CompetitionType.OPEN,
        Discipline.ALGORITHMIC,
        "Кубок Сибири — крупнейшее соревнование по алгоритмическому программированию в восточной "
            + "части России. Участникам предстоит решить 12 сложных задач за 5 часов. "
            + "Соревнование проводится по правилам ICPC.",
        "Новосибирск", today.plusDays(10), today.plusDays(12), today.plusDays(3),
        200, "500 000 ₽", true, regNsk,
        List.of("День 1, 10:00|Открытие и пробный тур",
            "День 2, 11:00|Основной тур соревнований",
            "День 3, 14:00|Награждение и закрытие"));

    CompetitionEntity champInfoSec = competition(
        "Чемпионат Москвы по информационной безопасности", CompetitionType.REGIONAL,
        Discipline.SECURITY,
        "Региональный чемпионат по кибербезопасности: CTF-турнир формата attack-defense. "
            + "К участию допускаются спортсмены из Москвы.",
        "Москва", today.plusDays(25), today.plusDays(29), today.plusDays(18),
        150, "300 000 ₽", true, regMsk,
        List.of("День 1, 12:00|Открытие и брифинг",
            "Дни 2–4, 10:00|CTF-турнир",
            "День 5, 15:00|Разбор задач и награждение"));

    CompetitionEntity vseros = competition(
        "Всероссийские соревнования по спортивному программированию", CompetitionType.FEDERAL,
        Discipline.PRODUCT,
        "Главные соревнования года, организованные Федерацией спортивного программирования. "
            + "Заявки подаются региональными представителями от сборных регионов.",
        "Казань", today.plusDays(45), today.plusDays(46), today.plusDays(35),
        400, "1 000 000 ₽", true, federation,
        List.of("День 1, 10:00|Открытие и основной тур",
            "День 2, 16:00|Награждение победителей"));

    CompetitionEntity arktika = competition(
        "Кубок Арктики по программированию роботов", CompetitionType.OPEN,
        Discipline.ROBOTICS,
        "Соревнование по программированию робототехники: автономная навигация, "
            + "манипуляторы и командные миссии. Открыто для всех желающих.",
        "Санкт-Петербург", today.plusDays(60), today.plusDays(63), today.plusDays(45),
        120, "400 000 ₽", true, regSpb,
        List.of("День 1, 11:00|Регистрация и калибровка",
            "Дни 2–3, 10:00|Отборочные миссии",
            "День 4, 13:00|Финал и награждение"));

    CompetitionEntity backendPro = competition(
        "Межвузовский турнир: Backend Pro", CompetitionType.REGIONAL,
        Discipline.PRODUCT,
        "Межрегиональный турнир для студентов Урала: проектирование и реализация "
            + "высоконагруженных сервисов. Доступен спортсменам Свердловской и Челябинской областей.",
        "Екатеринбург", today.plusDays(75), today.plusDays(77), today.plusDays(60),
        160, "200 000 ₽", true, regEkb,
        List.of("День 1, 10:00|Квалификационный раунд",
            "День 2, 11:00|Продуктовый хакатон",
            "День 3, 14:00|Финальные защиты и награждение"));

    CompetitionEntity devops = competition(
        "DevOps Challenge " + year, CompetitionType.OPEN,
        Discipline.PRODUCT,
        "Онлайн-соревнование по автоматизации инфраструктуры и CI/CD. "
            + "Индивидуальный зачёт: каждый участник соревнуется самостоятельно.",
        "Онлайн", today.plusDays(90), today.plusDays(91), today.plusDays(75),
        600, "150 000 ₽", true, federation,
        List.of("День 1, 10:00|Старт основного раунда",
            "День 2, 18:00|Подведение итогов"));

    CompetitionEntity autumnCup = competition(
        "Осенний кубок по алгоритмическому программированию", CompetitionType.OPEN,
        Discipline.ALGORITHMIC,
        "Прошедший кубок: 6 задач, 4 часа, индивидуальный и командный зачёт.",
        "Москва", today.minusDays(50), today.minusDays(49), today.minusDays(60),
        300, "250 000 ₽", true, regMsk,
        List.of("День 1, 11:00|Основной тур",
            "День 2, 15:00|Награждение"));

    CompetitionEntity winterChamp = competition(
        "Зимний чемпионат по робототехнике", CompetitionType.OPEN,
        Discipline.ROBOTICS,
        "Прошедший зимний чемпионат: командные состязания роботов-спасателей.",
        "Пермь", today.minusDays(100), today.minusDays(99), today.minusDays(110),
        180, "300 000 ₽", true, regNsk,
        List.of("День 1, 10:00|Отборочные заезды",
            "День 2, 13:00|Финал и награждение"));

    /* ---------- Итоги прошедших соревнований (сценарий 8) ---------- */
    // Осенний кубок — индивидуальный зачёт.
    result(autumnCup, false, alexey, null, 1, 940);
    result(autumnCup, false, ivan, null, 2, 915);
    result(autumnCup, false, maria, null, 3, 842);
    result(autumnCup, false, ksenia, null, 4, 790);
    result(autumnCup, false, artem, null, 5, 731);

    // Зимний чемпионат — индивидуальный зачёт.
    result(winterChamp, false, evgeny, null, 1, 820);
    result(winterChamp, false, maksim, null, 2, 780);
    result(winterChamp, false, maria, null, 3, 745);
    result(winterChamp, false, ivan, null, 4, 688);
    result(winterChamp, false, dasha, null, 5, 612);

    /* ---------- Заявки ---------- */
    // Личная заявка демо-спортсмена (одобрена — попадёт в «ближайшие события»).
    application(ivan, null, cubokSibiri, APPROVED, monthsAgo(2));

    // Личные заявки остальных спортсменов — заполняют модерацию и аналитику по месяцам.
    UserEntity[][] batches = {
        {alexey, maria, dmitry, ekaterina, anna},
        {sergey, olga, pavel, irina, nikolay},
        {ksenia, artem, gleb, dasha, maksim},
        {evgeny, timur, sofiya, ivanF, ekaterina},
        {dmitry, olga, irina, maksim, sofiya},
        {anna, pavel, timur, maria, nikolay},
        {gleb, dasha, sergey, ivanF, alexey},
    };
    ApplicationStatus[] statuses = {
        APPROVED, APPROVED, PENDING, APPROVED, REJECTED,
        APPROVED, PENDING, APPROVED, REJECTED, APPROVED,
        PENDING, APPROVED, APPROVED, REJECTED, APPROVED,
        APPROVED, APPROVED, PENDING, APPROVED, REJECTED,
        APPROVED, REJECTED, PENDING, APPROVED, APPROVED,
        PENDING, APPROVED, REJECTED, APPROVED, PENDING,
        APPROVED, APPROVED, PENDING, APPROVED, REJECTED,
    };
    CompetitionEntity[] targets = {
        cubokSibiri, cubokSibiri, cubokSibiri, cubokSibiri, cubokSibiri,
        champInfoSec, champInfoSec, champInfoSec, champInfoSec, champInfoSec,
        arktika, arktika, arktika, arktika, arktika,
        backendPro, backendPro, backendPro, backendPro, backendPro,
        devops, devops, devops, devops, devops,
        cubokSibiri, cubokSibiri, champInfoSec, champInfoSec, arktika,
        devops, devops, backendPro, backendPro, cubokSibiri,
    };
    int n = 0;
    for (int batch = 0; batch < batches.length; batch++) {
      for (int i = 0; i < batches[batch].length; i++) {
        UserEntity applicant = batches[batch][i];
        CompetitionEntity target = targets[n];
        if (applications.existsByCompetitionIdAndUserId(target.getId(), applicant.getId())) {
          n++;
          continue;
        }
        application(applicant, null, target, statuses[n], monthsAgo(6 - batch));
        n++;
      }
    }

    devops.setStatus(CompetitionStatus.PUBLISHED);
    competitions.save(devops);
  }

  /* ---------- Хелперы ---------- */

  private static final ApplicationStatus APPROVED = ApplicationStatus.APPROVED;
  private static final ApplicationStatus PENDING = ApplicationStatus.PENDING;
  private static final ApplicationStatus REJECTED = ApplicationStatus.REJECTED;

  private UserEntity user(String name, String email, Role role, String region, int rating,
                          String hash) {
    return users.save(UserEntity.builder()
        .fullName(name)
        .email(email)
        .passwordHash(hash)
        .role(role)
        .region(region)
        .rating(rating)
        .createdAt(Instant.now())
        .build());
  }

  private CompetitionEntity competition(String title, CompetitionType type, Discipline discipline,
                                        String description, String location, LocalDate start,
                                        LocalDate end, LocalDate regDeadline, int max,
                                        String prize, boolean individual, UserEntity organizer,
                                        List<String> schedule) {
    CompetitionEntity c = CompetitionEntity.builder()
        .title(title)
        .type(type)
        .discipline(discipline)
        .description(description)
        .location(location)
        .startDate(start)
        .endDate(end)
        .regDeadline(regDeadline)
        .maxParticipants(max)
        .prizeFund(prize)
        .individualFormat(individual)
        .status(CompetitionStatus.PUBLISHED)
        .organizer(organizer)
        .createdAt(Instant.now())
        .build();
    if (type == CompetitionType.REGIONAL) {
      c.getRegions().add(organizer.getRegion());
    }
    for (int i = 0; i < schedule.size(); i++) {
      String[] parts = schedule.get(i).split("\\|", 2);
      c.getScheduleItems().add(ScheduleItemEntity.builder()
          .competition(c)
          .timeLabel(parts[0])
          .eventText(parts.length > 1 ? parts[1] : "")
          .position(i)
          .build());
    }
    return competitions.save(c);
  }

  private void result(CompetitionEntity c, boolean isTeam, UserEntity user, TeamEntity team,
                      int place, int points) {
    results.save(ResultEntity.builder()
        .competition(c)
        .user(user)
        .team(team)
        .teamFlag(isTeam)
        .place(place)
        .points(points)
        .recordedAt(Instant.now())
        .build());
    // Итоги попадают в профиль: рейтинг участников растёт (сценарий 8 ТЗ).
    if (isTeam) {
      team.setRating(team.getRating() + points);
      if (place == 1) {
        team.setWins(team.getWins() + 1);
      }
      teams.save(team);
    } else {
      user.setRating(user.getRating() + points);
      users.save(user);
    }
  }

  private void application(UserEntity user, TeamEntity team, CompetitionEntity c,
                           ApplicationStatus status, Instant createdAt) {
    applications.save(ApplicationEntity.builder()
        .competition(c)
        .user(user)
        .team(team)
        .teamFlag(team != null)
        .region(user.getRegion())
        .status(status)
        .createdAt(createdAt)
        .decidedAt(status == PENDING ? null : createdAt.plusSeconds(3600))
        .build());
  }

  private static Instant monthsAgo(int months) {
    return LocalDateTime.now().minusMonths(months).toInstant(ZoneOffset.UTC);
  }

  private static Instant daysAgo(int days) {
    return LocalDateTime.now().minusDays(days).toInstant(ZoneOffset.UTC);
  }
}
