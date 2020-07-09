package org.jhipster.health.web.rest;

import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.jhipster.health.domain.Preferences}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PreferencesResource {

    private final Logger log = LoggerFactory.getLogger(PreferencesResource.class);

    private static final String ENTITY_NAME = "preferences";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PreferencesRepository preferencesRepository;

    public PreferencesResource(PreferencesRepository preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }

    /**
     * {@code POST  /preferences} : Create a new preferences.
     *
     * @param preferences the preferences to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new preferences, or with status {@code 400 (Bad Request)} if the preferences has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/preferences")
    public ResponseEntity<Preferences> createPreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to save Preferences : {}", preferences);
        if (preferences.getId() != null) {
            throw new BadRequestAlertException("A new preferences cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Preferences result = preferencesRepository.save(preferences);
        return ResponseEntity.created(new URI("/api/preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /preferences} : Updates an existing preferences.
     *
     * @param preferences the preferences to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated preferences,
     * or with status {@code 400 (Bad Request)} if the preferences is not valid,
     * or with status {@code 500 (Internal Server Error)} if the preferences couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/preferences")
    public ResponseEntity<Preferences> updatePreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to update Preferences : {}", preferences);
        if (preferences.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Preferences result = preferencesRepository.save(preferences);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, preferences.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /preferences} : get all the preferences.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of preferences in body.
     */
    @GetMapping("/preferences")
    public List<Preferences> getAllPreferences() {
        log.debug("REST request to get all Preferences");
        return preferencesRepository.findAll();
    }

    /**
     * {@code GET  /preferences/:id} : get the "id" preferences.
     *
     * @param id the id of the preferences to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the preferences, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/preferences/{id}")
    public ResponseEntity<Preferences> getPreferences(@PathVariable Long id) {
        log.debug("REST request to get Preferences : {}", id);
        Optional<Preferences> preferences = preferencesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(preferences);
    }

    /**
     * {@code DELETE  /preferences/:id} : delete the "id" preferences.
     *
     * @param id the id of the preferences to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/preferences/{id}")
    public ResponseEntity<Void> deletePreferences(@PathVariable Long id) {
        log.debug("REST request to delete Preferences : {}", id);

        preferencesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
